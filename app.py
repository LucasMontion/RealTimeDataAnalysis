from flask import Flask
from flask_cors import CORS
import pandas as pd
import datetime
import time

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

print(sample_price.head().to_json())

#sample_price['MA'] = sample_price["OrderPrice"].rolling(window=5).mean() # moving average


app = Flask(__name__)

CORS(app)
@app.route('/')
def start_server():
    start = 1704464880 # 01/05/2024
    global delta
    delta = int(time.time()) - start
    print("delta ", delta)
    return str(delta)


@app.route('/<prev_time>')
def upload_data(prev_time):
    global delta
    prev_time = datetime.datetime.fromtimestamp(int(prev_time))
    curr_time = datetime.datetime.fromtimestamp(int(time.time()) - delta)
    s = sample_price.query(f"TimeStampEpoch > '{prev_time}' and TimeStampEpoch <= '{curr_time}'")
    return [s["TimeStampEpoch"].to_list(), s["OrderPrice"].to_list()]

if __name__ == '__main__':
    global delta
    app.debug = True
    app.run()
