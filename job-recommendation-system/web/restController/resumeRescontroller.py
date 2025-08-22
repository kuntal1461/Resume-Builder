from flask import Flask, request, jsonify
from datetime import datetime
from core.services.userService import UserService  as userService# pyright: ignore[reportMissingImports]


app = Flask(__name__)

@app.route('/api/v1/resumesystem/login', methods=["POST"])
def user_login():
    data = request.get_json()
    userEmail = data.get('email')
    userPhone = data.get('phone')
    password = data.get('password')

    if not userEmail or not userPhone or not password:
        return jsonify({
            'status': 'error',
            'message': 'Email, phone number and password are required'
        }), 400
    # Authenticate user
    user = userService().authenticate_user(userEmail, password)

    if user:
        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name
            }
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'Invalid credentials'
        }), 401