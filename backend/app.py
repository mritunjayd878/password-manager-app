from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from models import db, User, Vault

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# Routes
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_pw = generate_password_hash(password)
    new_user = User(email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Signup successful"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id)
    return jsonify({"access_token": token}), 200

@app.route("/vault", methods=["GET", "POST"])
@jwt_required()
def vault():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if request.method == "GET":
        vault_items = [
            {
                "id": v.id,
                "website": v.website,
                "username": v.username,
                "password": v.password,
            }
            for v in user.vaults
        ]
        return jsonify({"vault": vault_items})

    if request.method == "POST":
        data = request.get_json()
        website = data.get("website")
        username = data.get("username")
        password = data.get("password")
        print(data)
        if not all([website, username, password]):
            return jsonify({"message": "Missing fields"}), 400

        new_entry = Vault(website=website, username=username, password=password, user_id=user.id)
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({"message": "Credential added successfully"}), 201

@app.route("/vault/<int:vault_id>", methods=["PUT", "DELETE"])
@jwt_required()
def modify_vault(vault_id):
    current_user_id = get_jwt_identity()
    vault_item = Vault.query.filter_by(id=vault_id, user_id=current_user_id).first()

    if not vault_item:
        return jsonify({"message": "Vault item not found"}), 404

    if request.method == "PUT":
        data = request.get_json()
        vault_item.website = data.get("website", vault_item.website)
        vault_item.username = data.get("username", vault_item.username)
        vault_item.password = data.get("password", vault_item.password)
        db.session.commit()
        return jsonify({"message": "Vault item updated"}), 200

    if request.method == "DELETE":
        db.session.delete(vault_item)
        db.session.commit()
        return jsonify({"message": "Vault item deleted"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=False)

