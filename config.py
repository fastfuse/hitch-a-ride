import os


class Config(object):
    CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('SECRET_KEY',
                                '\x86Zh\x91\xd4\x05]\x1d\x950\xe5\xa3\x01UC\x08)\xc44_\xc1\xc7\xe6~')

    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT',
                                            '\xf8p\x85eQ\xe9L\xf9iy\xc6\xb8\xd1\x87q\xed\xde\xc3\xef\xf4')

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL',
                                             "postgresql://hitch:admin@localhost/hitch_db")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY',
                                    '\xd3t\xa3j1\xb8?\x06\xa7)\xac \x8e\xd62j\xa6\xc0\xe0\xa11\x8dR\xc2')

    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']

    # mail settings
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    # gmail authentication
    MAIL_USERNAME = os.environ.get('APP_MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('APP_MAIL_PASSWORD')

    # mail accounts
    MAIL_DEFAULT_SENDER = 'hitch.ride@noreply.com'


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class StagingConfig(Config):
    pass


class ProductionConfig(Config):
    DEBUG = False
