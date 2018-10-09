import os

from flask import Flask
from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])

# Login
login = LoginManager(app)

# Database
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# logger instance
logger = app.logger

# JWT stuff
jwt = JWTManager(app)

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
