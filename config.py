import os


class Config(object):
    CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('SECRET_KEY',
                                'your-secret-key')

    # >>> import os
    # >>> os.urandom(24)
    # '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'
    # Just take that thing and copy/paste into your code and you're done.


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class StagingConfig(Config):
    pass


class ProductionConfig(Config):
    DEBUG = False
