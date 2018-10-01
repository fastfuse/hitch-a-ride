import os


class Config(object):
    CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('SECRET_KEY',
                                '\x86Zh\x91\xd4\x05]\x1d\x950\xe5\xa3\x01UC\x08)\xc44_\xc1\xc7\xe6~')

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL',
                                             "postgresql://hitch:admin@postgres:5432/hitch_db")

    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class StagingConfig(Config):
    pass


class ProductionConfig(Config):
    DEBUG = False
