import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_secret_key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('postgresql://myuser:mypassword@localhost/school') or 'sqlite:///site.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    