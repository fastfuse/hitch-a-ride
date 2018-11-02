import os

from flask import Flask
from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from celery import Celery
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
CORS(app)

# Mail
mail = Mail(app)

# Login
login = LoginManager(app)

# Database
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# logger instance
logger = app.logger

# JWT stuff
jwt = JWTManager(app)

# Celery
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

# ===========================================


from . import models
from .admin import admin_blueprint
from .auth import auth_blueprint
from .index import index_blueprint
from .api import api_blueprint

app.register_blueprint(admin_blueprint)
app.register_blueprint(auth_blueprint)
app.register_blueprint(index_blueprint)
app.register_blueprint(api_blueprint)
