
from flask import Flask
import os


app = Flask(__name__)

app.config['DEBUG'] = True


from app import views
