# Password Manager Application

A secure, modern web-based password manager built with Flask, SQLite, and a responsive frontend.


## Features

- 🔐 **Secure Authentication**: JWT-based authentication with password hashing
- 📝 **Credential Management**: Add, view, edit, and delete website credentials
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- 🚀 **Containerized**: Easy deployment with Docker and Docker Compose
- 🔒 **Security First**: Password hashing, CORS protection, and secure API endpoints

## Tech Stack

### Backend
- **Framework**: Flask 2.2.5
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Werkzeug password hashing, CORS protection

### Frontend
- **HTML/CSS**: Tailwind CSS for styling
- **JavaScript**: Vanilla JS for API interactions
- **Web Server**: Nginx for serving static files and proxying API requests

### Deployment
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/password-manager-app.git
   cd password-manager-app
   ```

2. Create a `.env` file in the backend directory with the following content:
   ```
   SECRET_KEY=your_secret_key_here
   JWT_SECRET_KEY=your_jwt_secret_key_here
   ```

3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

4. Access the application at http://localhost

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Access your account with your credentials
3. **Manage Credentials**: Add, view, edit, and delete your website credentials

## API Endpoints

- `POST /signup`: Register a new user
- `POST /login`: Authenticate a user and get a JWT token
- `GET /vault`: Retrieve all credentials for the authenticated user
- `POST /vault`: Add a new credential
- `PUT /vault/<id>`: Update an existing credential
- `DELETE /vault/<id>`: Delete a credential

## Security Considerations

- Passwords are hashed using Werkzeug's secure hashing
- JWT tokens are used for authentication
- CORS protection is implemented
- API endpoints are protected with authentication
- Input validation is performed on all requests

## Future Enhancements

- Password encryption at rest
- Two-factor authentication
- Password strength validation
- Password generation
- Auto-fill browser extension
- Password sharing
- Backup and restore functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Flask and its extensions
- SQLAlchemy
- Tailwind CSS
- Docker and Nginx
- The open-source community 