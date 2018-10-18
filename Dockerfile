FROM python:3.6-slim

RUN echo 'Dockerfile-Application'

RUN mkdir /app
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt

# environment variables
ENV APP_SETTINGS="config.ProductionConfig"
ENV FLASK_APP="application/__init__.py"
# do not set it for production
ENV FLASK_ENV="development"

# expose port
EXPOSE 5000

# run
#ENTRYPOINT flask db upgrade && flask run --host=0.0.0.0
ENTRYPOINT flask run --host=0.0.0.0