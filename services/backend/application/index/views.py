# -*- coding: utf-8 -*-

from flask import render_template

from application import app


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/map')
def map():
    return render_template('draft.html')
