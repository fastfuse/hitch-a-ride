### Hitch A Ride


#### Development:
* Create and activate virtual environment
```sh
$ python3 -m venv <your-venv>
$ source <your-venv-dir>/bin/activate
```

* Navigate to project directory and install requirements
```sh
$ cd <project_dir>
$ pip install -r requirements.txt
```

* Create `.env` file with following items
```sh
APP_SETTINGS=config.DevelopmentConfig
FLASK_APP=app/__init__.py
FLASK_ENV=development
```

* Run development server
```sh
flask run
```


Or using Docker:
```sh
$ cd <your-newly-created-project>
$ docker build . -t <image-name>
$ docker run -it -p 5000:5000 <image-name>
```

Open your browser and check [127.0.0.1:5000](http://127.0.0.1:5000)
