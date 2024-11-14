from flask import Flask, render_template, redirect, url_for, request, flash, session,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import os, base64
from config import Config
from flask_mail import Mail, Message
import calendar
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

# Initialize Flask App
app = Flask(__name__)
app.config.from_object('config.Config')
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'your-email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your-email-password'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

# Initialize Database, Bcrypt for hashing, and Flask-Login for authentication
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
mail = Mail(app)

os.makedirs(os.path.join('staticP', 'uploads'), exist_ok=True)

# Models
class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    user_type = db.Column(db.String(10), nullable=False)  # 'student' or 'admin'
    name = db.Column(db.String(100))
    surname = db.Column(db.String(100))
    student_number = db.Column(db.String(100), unique=True, nullable=True)
    course = db.Column(db.String(100), nullable=True)
    year_of_study = db.Column(db.Integer, nullable=True)
    face_image_path = db.Column(db.String(255), nullable=True)  # Optional face image

    def __repr__(self):
        return f"<User {self.email}>"
    
# Flask-Login manager
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Routes for Signup, Login, Logout, and Dashboards
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user_type = request.form['user_type']
        user = User.query.filter_by(email=email, user_type=user_type).first()
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            session['user_type'] = user_type
            if user_type == 'admin':
                return redirect(url_for('admin_dashboard'))
            return redirect(url_for('student_dashboard'))
        flash('Invalid credentials.')
        return redirect(url_for('index'))
    return render_template('index.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        surname = request.form['surname']
        student_number = request.form['student_number']
        course = request.form['course']
        year_of_study = request.form['year_of_study']
        email = request.form['email']
        password = bcrypt.generate_password_hash(request.form['password']).decode('utf-8')
        user_type = request.form['user_type']
        captured_image_data = request.form.get('captured_image')

        user = User.query.filter_by(email=email).first()
        if user:
            flash('Email address already exists')
            return redirect(url_for('signup'))

        # Save captured image if student and facial recognition data is provided
        face_image = request.files.get('face_image')
        face_image_path = None
        if face_image and user_type == 'student':
            filename = secure_filename(f"{student_number}_face.png")
            image_path = os.path.join('staticP/uploads', filename)
            face_image.save(image_path)
            face_image_path = filename

        # Create new user
        new_user = User(
            name=name, surname=surname, student_number=student_number, course=course, # type: ignore
            year_of_study=year_of_study, email=email, password=password, user_type=user_type, # type: ignore
            face_image_path=face_image_path # type: ignore
        )
        db.session.add(new_user)
        db.session.commit()
        flash('Account created! Please log in.')
        return redirect(url_for('index'))
    return render_template('signup.html')

@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email')
        user = User.query.filter_by(email=email).first()
        if user:
            flash('Password reset link has been sent to your email.')
            # Implement the password reset functionality here.
        else:
            flash('Email not found.')
            return redirect(url_for('index'))
    return render_template('forgot_password.html')

@app.route('/student_dashboard')
@login_required
def student_dashboard():
    if current_user.user_type == 'student':
        return render_template('student_dashboard.html', user=current_user)
    return redirect(url_for('index'))

@app.route('/admin_dashboard')
@login_required
def admin_dashboard():
    if current_user.user_type == 'admin':
        # Fetch admin-specific data here
        
        return render_template('admin_dashboard.html', user=current_user)
    return redirect(url_for('index'))

@app.route('/send_email', methods=['POST'])
@login_required
def send_email():
    if current_user.user_type == 'lecturer':
        data = request.get_json()
        recipient_email = data.get('email')
        message_content = data.get('message')
        
        msg = Message('Message from Lecturer', 
                      sender='your-email@gmail.com', 
                      recipients=[recipient_email])
        msg.body = message_content
        mail.send(msg)
        
        return 'Email sent!', 200
    return 'Unauthorized', 403

@app.route('/logout')
@login_required
def logout():
    logout_user()
    session.pop('user_type', None)
    return redirect(url_for('index'))



if __name__ == '__main__':
    app.run(debug=True)
    #app.run(host='127.0.0.1', port=5000, debug=True)

