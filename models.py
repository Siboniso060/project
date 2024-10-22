from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    student_number = db.Column(db.String(20), unique=True, nullable=True)
    course = db.Column(db.String(100), nullable=True)
    year_of_study = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # student, admin, etc.
    face_image_path = db.Column(db.String(255), nullable=True)  # Path to saved face image

    def __init__(self, name, surname, student_number, course, year_of_study, email, password, user_type, face_image_path):
        self.name = name
        self.surname = surname
        self.student_number = student_number
        self.course = course
        self.year_of_study = year_of_study
        self.email = email
        self.password = password
        self.user_type = user_type
        self.face_image_path = face_image_path
