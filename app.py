from flask import Flask
from flask_cors import CORS

import random
app = Flask(__name__)

CORS(app)
@app.route('/')
def hello_world():
    return str(random.randint(1, 10))