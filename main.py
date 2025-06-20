from flask import Flask, request, jsonify, render_template, session, redirect
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
from datetime import timedelta
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import storage
import uuid

# Load environment variables
if os.getenv("RENDER") is None:
    load_dotenv()

# Firebase & Firestore Init
firebase_key_path = os.getenv("FIREBASE_KEY_PATH")

if not firebase_key_path or not os.path.exists(firebase_key_path):
    raise FileNotFoundError(f"❌ FIREBASE_KEY_PATH is not set or file doesn't exist: {firebase_key_path}")

cred = credentials.Certificate(firebase_key_path)
firebase_admin.initialize_app(cred)


# Flask Init
app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = os.getenv("SUPER_SECRET_KEY")
app.permanent_session_lifetime = timedelta(days=30)

# Mail Config
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_DEFAULT_SENDER") or "chloenicola7@gmail.com"
mail = Mail(app)

# GCS Upload Helper
def upload_to_gcs(file_obj, filename, content_type):
    bucket_name = "closet1821-images"
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(f"items/{uuid.uuid4()}-{filename}")
    blob.upload_from_file(file_obj, content_type=content_type)
    blob.make_public()  # Optional: remove if using signed URLs
    return blob.public_url

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/test_db")
def test_db():
    docs = firestore_db.collection("users").stream()
    return {"documents": [doc.id for doc in docs]}

@app.route('/home')
def shop():
    return render_template('home.html')

@app.route('/account')
def account():
    return render_template('account.html')

@app.route('/add')
def add():
    return render_template('add.html')

@app.route('/feedback')
def feedback():
    return render_template('feedback.html')

@app.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')

@app.route('/register', methods=['GET'])
def register_page():
    return render_template('register.html')

@app.route('/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user_ref = firestore_db.collection("users").document(email)
    user_doc = user_ref.get()
    if not user_doc.exists:
        return jsonify({"error": "Invalid credentials"}), 401

    user = user_doc.to_dict()
    if not check_password_hash(user['password_hash'], password):
        return jsonify({"error": "Invalid credentials"}), 401

    session.permanent = True
    session["user_email"] = user['email']
    session["user_name"] = user['name']
    session["buyer_number"] = user.get('buyer_number', '')
    return jsonify({"message": "Login successful"}), 200

@app.route('/register', methods=['POST'])
def handle_register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone", "")

    user_ref = firestore_db.collection("users").document(email)
    if user_ref.get().exists:
        return jsonify({"error": "Email already registered"}), 400

    user_ref.set({
        "name": name,
        "email": email,
        "password_hash": generate_password_hash(password),
        "buyer_number": phone
    })

    session["user_email"] = email
    session["user_name"] = name
    session["buyer_number"] = phone
    return jsonify({"message": "Registration successful"}), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})

@app.route('/me', methods=['GET'])
def me():
    if 'user_email' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({
        "name": session.get("user_name"),
        "email": session.get("user_email"),
        "buyerNumber": session.get("buyer_number")
    })

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    feedback_text = data.get('feedback')

    if not feedback_text:
        return jsonify({'error': 'Feedback is required'}), 400

    try:
        msg = Message(subject="New Closet 1821 Feedback",
                      recipients=[app.config['MAIL_DEFAULT_SENDER']],
                      body=feedback_text)
        mail.send(msg)
        return jsonify({'message': 'Feedback received'}), 200
    except Exception:
        return jsonify({'error': 'Failed to send feedback'}), 500

@app.route('/add_item', methods=['POST'])
def add_item():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    name = request.form.get('name')
    description = request.form.get('description', 'No description provided')
    rent_price = request.form.get('rent_price', None)
    buy_price = request.form.get('buy_price', None)
    owner_email = session.get('user_email', 'guest@gmail.com')
    owner_number = session.get('buyer_number', '')
    image = request.files['image']

    try:
        image_url = upload_to_gcs(image, image.filename, image.content_type)
    except Exception as e:
        return jsonify({"error": f"Image upload failed: {e}"}), 500

    # Save item in Firestore
    item_data = {
        "name": name,
        "description": description,
        "rent_price": rent_price,
        "buy_price": buy_price,
        "image_path": image_url,
        "owner_email": owner_email,
        "owner_number": owner_number
    }

    firestore_db.collection("items").add(item_data)

    return jsonify({"message": "Item added successfully!"})

@app.route('/get_items', methods=['GET'])
def get_items():
    items = firestore_db.collection("items").stream()
    return jsonify({
        "items": [
            dict(item.to_dict(), id=item.id)
            for item in items
        ]
    })

@app.route('/get_user_items', methods=['GET'])
def get_user_items():
    email = request.args.get('owner_email')
    if not email:
        return jsonify({"error": "Missing email"}), 400

    items = firestore_db.collection("items").where("owner_email", "==", email).stream()
    return jsonify({
        "items": [
            dict(item.to_dict(), id=item.id)
            for item in items
        ]
    })

@app.route('/delete_item/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    doc_ref = firestore_db.collection("items").document(item_id)
    if not doc_ref.get().exists:
        return jsonify({"error": "Item not found"}), 404

    doc_ref.delete()
    return jsonify({"message": "Item deleted successfully!"})

@app.route('/notify_seller', methods=['POST'])
def notify_seller():
    data = request.get_json()
    buyer_name = data.get("buyer_name")
    buyer_email = data.get("buyer_email")
    item_name = data.get("item_name")
    seller_email = data.get("seller_email")
    buyer_number = data.get("buyer_number")

    if not (buyer_name and buyer_email and item_name and seller_email):
        return jsonify({"error": "Missing required information"}), 400

    try:
        msg = Message(
            subject="Interest in Your Item on Closet 1821",
            sender=app.config['MAIL_USERNAME'],
            recipients=[seller_email],
            body=(
                f"Hello,\n\n"
                f"{buyer_name} ({buyer_email}, Phone: {buyer_number}) is interested in '{item_name}'.\n\n"
                f"You can text or call them to finalize the transaction.\n\n"
                f"Best,\nCloset 1821"
            )
        )
        mail.send(msg)
        return jsonify({"message": "Notification email sent successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))
