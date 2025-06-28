from flask import Flask, request, jsonify, render_template, session
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
from datetime import timedelta
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import storage, vision
import uuid
from google.cloud import firestore as gcf

# Load environment variables
if os.getenv("RENDER") is None:
    load_dotenv()

# Firebase & Firestore Init
FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH", "firebase-key.json")
if not os.path.exists(FIREBASE_KEY_PATH):
    raise FileNotFoundError(f"FIREBASE_KEY_PATH missing: {FIREBASE_KEY_PATH}")

cred = credentials.Certificate(FIREBASE_KEY_PATH)
firebase_admin.initialize_app(cred, {'storageBucket': 'closet1821-images.appspot.com'})
firestore_db = firestore.client()

# Storage & Vision clients
BUCKET_NAME = 'closet1821-images'
storage_client = storage.Client()
vision_client = vision.ImageAnnotatorClient()

# Valid categories (for both predict_labels & add_item)
VALID_CATEGORIES = ['shirt', 'pants', 'dress', 'shorts', 'shoes', 'accessories', 'other']

# Flask Init
app = Flask(__name__, static_folder='templates/static', template_folder='templates')
app.secret_key = os.getenv("SUPER_SECRET_KEY")
app.permanent_session_lifetime = timedelta(days=30)

# Mail Config
def _init_mail(app):
    app.config.update(
        MAIL_SERVER='smtp.gmail.com',
        MAIL_PORT=587,
        MAIL_USE_TLS=True,
        MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
        MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
        MAIL_DEFAULT_SENDER=os.getenv("MAIL_DEFAULT_SENDER") or os.getenv("MAIL_USERNAME")
    )
    return Mail(app)

mail = _init_mail(app)

# Helpers
def upload_to_gcs(file_obj, filename, content_type):
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(f"items/{uuid.uuid4()}-{filename}")
    blob.upload_from_file(file_obj, content_type=content_type)
    return blob.public_url


def get_vision_labels(image_uri):
    image = vision.Image()
    image.source.image_uri = image_uri
    response = vision_client.label_detection(image=image)
    return [label.description.lower() for label in response.label_annotations]

# Routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify(error="Email and password required"), 400

    doc = firestore_db.collection('users').document(email).get()
    if not doc.exists:
        return jsonify(error="Invalid credentials"), 401

    user = doc.to_dict()
    if not check_password_hash(user.get('password_hash',''), password):
        return jsonify(error="Invalid credentials"), 401

    session.permanent = True
    session['user_email'] = user['email']
    session['user_name'] = user['name']
    session['buyer_number'] = user.get('buyer_number','')
    return jsonify(message="Login successful"), 200

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not all([name, email, password]):
        return jsonify(error="Name, email, and password required"), 400

    user_ref = firestore_db.collection('users').document(email)
    if user_ref.get().exists:
        return jsonify(error="Email already registered"), 400

    user_ref.set({
        'name': name,
        'email': email,
        'password_hash': generate_password_hash(password),
        'buyer_number': data.get('phone','')
    })
    session['user_email'] = email
    session['user_name'] = name
    session['buyer_number'] = data.get('phone','')
    return jsonify(message="Registration successful"), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify(message="Logged out"), 200

@app.route('/me', methods=['GET'])
def me():
    if 'user_email' not in session:
        return jsonify(error="Unauthorized"), 401
    return jsonify(
        name=session['user_name'],
        email=session['user_email'],
        buyerNumber=session.get('buyer_number','')
    ), 200

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json() or {}
    text = data.get('feedback','').strip()
    if not text:
        return jsonify(error="Feedback is required"), 400
    try:
        msg = Message(
            subject="New Closet 1821 Feedback",
            recipients=[app.config['MAIL_DEFAULT_SENDER']],
            body=text
        )
        mail.send(msg)
        return jsonify(message="Feedback received"), 200
    except Exception as e:
        app.logger.error("Feedback send error: %s", e)
        return jsonify(error="Failed to send feedback"), 500

@app.route('/predict_labels', methods=['POST'])
def predict_labels():
    if 'images' not in request.files:
        return jsonify(error="No images provided"), 400
    img = request.files.getlist('images')[0]
    uri = upload_to_gcs(img, img.filename, img.content_type)
    labels = get_vision_labels(uri)
    picks = [l for l in labels if l in VALID_CATEGORIES[:-1]]
    top3 = picks[:3] + [c for c in VALID_CATEGORIES[:-1] if c not in picks][:max(0,3-len(picks))]
    return jsonify(predictions=top3), 200

@app.route('/add_item', methods=['POST'])
def add_item():
    if 'images' not in request.files:
        return jsonify(error="No images uploaded"), 400
    # gather form data
    name = request.form.get('name','').strip()
    description = request.form.get('description','').strip() or 'No description provided'
    rent_price = request.form.get('rent_price')
    buy_price = request.form.get('buy_price')
    category = request.form.get('category','').lower()
    owner_email = session.get('user_email','')
    owner_number = session.get('buyer_number','')

    # ensure valid category
    if category not in VALID_CATEGORIES:
        category = 'other'

    # upload images
    files = request.files.getlist('images')
    urls = [upload_to_gcs(f, f.filename, f.content_type) for f in files if f.filename]
    if not urls:
        return jsonify(error="No valid images"), 400

    item = {
        'name': name,
        'description': description,
        'rent_price': rent_price,
        'buy_price': buy_price,
        'image_path': urls[0],
        'image_paths': urls,
        'owner_email': owner_email,
        'owner_number': owner_number,
        'category': category,
        'created_at': gcf.SERVER_TIMESTAMP   
    }
    doc_ref = firestore_db.collection('items').add(item)
    return jsonify(id=doc_ref[1].id, message="Item added"), 201

@app.route('/get_items', methods=['GET'])
def get_items():
    category = request.args.get('category')
    col = firestore_db.collection('items')
    if category:
        col = col.where('category', '==', category)
    # order newest→oldest
    docs = col.order_by('created_at', direction=gcf.Query.DESCENDING).stream()
    items = [dict(doc.to_dict(), id=doc.id) for doc in docs]
    return jsonify(items=items), 200

@app.route('/get_user_items', methods=['GET'])
def get_user_items():
    email = request.args.get('owner_email')
    if not email:
        return jsonify(error="Missing email"), 400

    # add order_by here
    docs = (
        firestore_db
        .collection('items')
        .where('owner_email', '==', email)
        .order_by('created_at', direction=gcf.Query.DESCENDING)
        .stream()
    )

    items = [dict(doc.to_dict(), id=doc.id) for doc in docs]
    return jsonify(items=items), 200

@app.route('/delete_item/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    doc_ref = firestore_db.collection('items').document(item_id)
    if not doc_ref.get().exists:
        return jsonify(error="Not found"), 404
    doc_ref.delete()
    return jsonify(message="Deleted"), 200

@app.route('/edit_item/<item_id>', methods=['PATCH', 'PUT'])
def edit_item(item_id):
    if 'user_email' not in session:
        return jsonify(error="Unauthorized"), 401
    doc_ref = firestore_db.collection('items').document(item_id)
    if not doc_ref.get().exists:
        return jsonify(error="Not found"), 404
    item = doc_ref.get().to_dict()
    if item.get('owner_email') != session['user_email']:
        return jsonify(error="Forbidden"), 403
    updates = request.get_json() or {}
    doc_ref.update(updates)
    updated = doc_ref.get().to_dict()
    updated['id'] = item_id
    return jsonify(updated), 200

@app.route('/notify_seller', methods=['POST'])
def notify_seller():
    data = request.get_json() or {}
    buyer_name = data.get('buyer_name')
    buyer_email = data.get('buyer_email')
    item_name = data.get('item_name')
    seller_email = data.get('seller_email')
    if not all([buyer_name, buyer_email, item_name, seller_email]):
        return jsonify(error="Missing info"), 400
    try:
        msg = Message(
            subject="Interest in Your Item",
            recipients=[seller_email],
            body=(
                f"{buyer_name} ({buyer_email}) is interested in '{item_name}'."
                " Please contact them directly."
            )
        )
        mail.send(msg)
        return jsonify(message="Seller notified"), 200
    except Exception as e:
        app.logger.error("Notify error: %s", e)
        return jsonify(error="Failed to notify"), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
