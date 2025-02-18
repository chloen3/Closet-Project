from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///closet.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define Item Model
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    rent_price = db.Column(db.String(20), nullable=True)
    buy_price = db.Column(db.String(20), nullable=True)
    image_path = db.Column(db.String(200), nullable=False)
    owner_id = db.Column(db.String(100), nullable=False)  # Track item owner

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

# API Route: Get Items
@app.route('/get_items', methods=['GET'])
def get_items():
    items = Item.query.all()
    items_list = [
        {"id": item.id, "name": item.name, "description": item.description,
         "rent_price": item.rent_price, "buy_price": item.buy_price,
         "image_path": item.image_path, "owner_id": item.owner_id}
        for item in items
    ]
    return jsonify({"items": items_list})

# API Route: Add Item
@app.route('/add_item', methods=['POST'])
def add_item():
    name = request.form['name']
    description = request.form.get('description', 'No description provided')
    rent_price = request.form.get('rent_price', None)
    buy_price = request.form.get('buy_price', None)
    owner_id = request.form['owner_id']
    image = request.files['image']

    upload_folder = "static/uploads"
    os.makedirs(upload_folder, exist_ok=True)
    image_path = os.path.join(upload_folder, image.filename)
    image.save(image_path)

    new_item = Item(name=name, description=description, rent_price=rent_price,
                    buy_price=buy_price, image_path=image_path, owner_id=owner_id)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"message": "Item added successfully!"})

# Start Flask Server
if __name__ == '__main__':
    app.run(debug=True)
