import os
from flask import request, redirect, render_template, url_for
from app import app, db, bcrypt
from models import User

# Define the folder where images will be stored
UPLOAD_FOLDER = 'staticP/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Sign-up route
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Get form data
        name = request.form.get('name')
        surname = request.form.get('surname')
        student_number = request.form.get('student_number')
        course = request.form.get('course')
        year_of_study = request.form.get('year_of_study')
        email = request.form.get('email')
        password = request.form.get('password')
        user_type = request.form.get('user_type')

        # Handle the face image upload
        face_image = request.files.get('face_image')
        face_image_path = None

        if face_image:
            face_image_path = os.path.join(app.config['staticP/uploads'], face_image.filename)  # type: ignore
            face_image.save(face_image_path)

        # Hash the password before storing
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create a new user
        new_user = User(
            name=name, surname=surname, student_number=student_number, course=course,
            year_of_study=year_of_study, email=email, password=hashed_password, 
            user_type=user_type, face_image_path=face_image_path
        )

        # Add to the database
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for('login'))

    return render_template('signup.html')
