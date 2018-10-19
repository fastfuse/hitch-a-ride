"""
Celery tasks.
"""
import datetime

from flask_mail import Message

from application import celery, app, mail, db
from application.models import TokenBlacklist


@celery.task
def send_email(to, subject, template):
    """
    Send confirmation email
    """
    with app.app_context():
        msg = Message(
            subject,
            recipients=[to],
            html=template,
            sender=app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)


@celery.task
def prune_database():
    """
    Delete expired tokens from the database.
    How (and if) you call this is entirely up you. You could expose it to an
    endpoint that only administrators could call, you could run it as a cron,
    set it up with flask cli, etc.
    """
    now = datetime.datetime.now()
    expired = TokenBlacklist.query.filter(TokenBlacklist.expires < now).all()

    for token in expired:
        token.delete()

    db.session.commit()
