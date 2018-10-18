"""
Celery tasks.
"""

from flask_mail import Message

from application import celery, app, mail


@celery.task
def dummy():
    """
    Dummy task
    """

    print('Dummy task')


@celery.task
def send_email(to, subject, template):
    msg = Message(
        subject,
        recipients=[to],
        html=template,
        sender=app.config['MAIL_DEFAULT_SENDER']
    )
    mail.send(msg)
