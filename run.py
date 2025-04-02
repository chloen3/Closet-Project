from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv

if os.getenv("RENDER") is None:
    load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')


# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///closet.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Gmail SMTP server
app.config['MAIL_PORT'] = 587  # TLS Port
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_DEFAULT_SENDER'] = "chloenicola7@gmail.com"  # Default sender email


mail = Mail(app)

with app.app_context():
    db.create_all()


# Define Item Model
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    rent_price = db.Column(db.String(20), nullable=True)
    buy_price = db.Column(db.String(20), nullable=True)
    image_path = db.Column(db.String(200), nullable=False)
    owner_email = db.Column(db.String(100), nullable=False)  # Track item owner by email


# Create database tables
with app.app_context():
    db.create_all()


# Serve Frontend Pages
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/account')
def account():
    return render_template('account.html')

@app.route('/add')
def add():
    return render_template('add.html')

@app.route('/home')
def shop():
    return render_template('home.html')

# API Route: Get User Items
@app.route('/get_user_items', methods=['GET'])
def get_user_items():
    owner_email = request.args.get('owner_email', None)
    if not owner_email:
        return jsonify({"error": "User email not provided"}), 400

    user_items = Item.query.filter_by(owner_email=owner_email).all()
    items_list = [
        {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "rent_price": item.rent_price,
            "buy_price": item.buy_price,
            "image_path": f"/static/uploads/{os.path.basename(item.image_path)}",
            "owner_email": item.owner_email
        }
        for item in user_items
    ]
    return jsonify({"items": items_list})

@app.route('/get_items', methods=['GET'])
def get_items():
    items = Item.query.all()
    items_list = [
        {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "rent_price": item.rent_price,
            "buy_price": item.buy_price,
            "image_path": f"/static/uploads/{os.path.basename(item.image_path)}",
            "owner_email": item.owner_email
        }
        for item in items
    ]
    return jsonify({"items": items_list})

# API Route: Add Item
@app.route('/add_item', methods=['POST'])
def add_item():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    name = request.form.get('name')
    description = request.form.get('description', 'No description provided')
    rent_price = request.form.get('rent_price', None)
    buy_price = request.form.get('buy_price', None)
    owner_email = request.form.get('owner_email', 'guest@gmail.com')
    owner_number = request.form.get('phoneNumber', None)
    image = request.files['image']

    # Save the image
    upload_folder = "static/uploads"
    os.makedirs(upload_folder, exist_ok=True)
    image_path = os.path.join(upload_folder, image.filename)
    image.save(image_path)

    # Save to database
    new_item = Item(name=name, description=description, rent_price=rent_price,
                    buy_price=buy_price, image_path=image_path, owner_email=owner_email)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"message": "Item added successfully!"})

@app.route('/delete_item/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = Item.query.get(item_id)
    if item:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Item deleted successfully!"})
    return jsonify({"error": "Item not found"}), 404

@app.route('/notify_seller', methods=['POST'])
def notify_seller():
    data = request.json
    buyer_name = data.get("buyer_name")
    buyer_email = data.get("buyer_email")
    item_name = data.get("item_name")
    seller_email = data.get("seller_email")

    if not (buyer_name and buyer_email and item_name and seller_email):
        return jsonify({"error": "Missing required information"}), 400

    try:
        msg = Message(
            subject="Interest in Your Item on Closet 1821",
            sender=app.config['MAIL_USERNAME'],
            recipients=[seller_email],
            body=f"Hello,\n\n{buyer_name} ({buyer_email}) is interested in purchasing '{item_name}'.\n\nPlease contact them to finalize the transaction.\n\nBest,\nCloset 1821"
        )
        mail.send(msg)
        print("✅ Email sent successfully!")  # ✅ Force log
        return jsonify({"message": "Notification email sent successfully!"}), 200

    except Exception as e:
        print(f"❌ Error sending email: {e}")  # ✅ Force log errors
        return jsonify({"error": str(e)}), 500




# Start Flask Server
if __name__ == '__main__':
    app.run(debug=True)
