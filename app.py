from flask import Flask
from flask_cors import CORS
import pandas as pd
import time
import datetime

import random

ex_1 = pd.read_json("nbc_data/Exchange_1.json")
ex_2 = pd.read_json("nbc_data/Exchange_2.json")
ex_3 = pd.read_json("nbc_data/Exchange_3.json")

total_df = pd.concat([ex_1, ex_2, ex_3])

sym_1 = ex_1["Symbol"].value_counts().keys().tolist()
sym_2 = ex_2["Symbol"].value_counts().keys().tolist()
sym_3 = ex_3["Symbol"].value_counts().keys().tolist()

order_req_1 = ex_1.query("MessageType == 'NewOrderRequest'")
order_ac_1 = ex_1.query("MessageType == 'NewOrderAcknowledged'")
order_req_2 = ex_2.query("MessageType == 'NewOrderRequest'")
order_ac_2 = ex_2.query("MessageType == 'NewOrderAcknowledged'")
order_req_3 = ex_3.query("MessageType == 'NewOrderRequest'")
order_ac_3 = ex_3.query("MessageType == 'NewOrderAcknowledged'")

order_req_1 = ex_1.query("MessageType == 'NewOrderRequest'")
order_ac_1 = ex_1.query("MessageType == 'NewOrderAcknowledged'")
order_req_2 = ex_2.query("MessageType == 'NewOrderRequest'")
order_ac_2 = ex_2.query("MessageType == 'NewOrderAcknowledged'")
order_req_3 = ex_3.query("MessageType == 'NewOrderRequest'")
order_ac_3 = ex_3.query("MessageType == 'NewOrderAcknowledged'")

sample_price = order_req_1[order_req_1["Symbol"] == sym_1[0]]

# sample_price['MA'] = sample_price["OrderPrice"].rolling(window=5).mean() # moving average

global start 
global delta

app = Flask(__name__)

CORS(app)
# @app.route('/<start_time>')
# def start_server(start_time):
#     start = start_time
#     delta = datetime.datetime.now() - start
#     return start

delta = 0

# @app.route('/')
# def get_date():
#     return sample_price.query(f"{datetime.datetime.fromtimestamp(1704464880)}<TimeStampEpoch <= {datetime.datetime.fromtimestamp(1704474880)}").to_dict()  

@app.route('/<prev_time>')
def upload_data(prev_time):
    prev_time = datetime.datetime.fromtimestamp(int(prev_time))
    curr_time = datetime.datetime.fromtimestamp(int(time.time()) - delta)
    print(int(time.time()) - delta)
    return sample_price.query(f"TimeStampEpoch > '{prev_time}' and TimeStampEpoch <= '{curr_time}'")[["TimeStamp", "OrderPrice"]].to_dict()
    