from flask import Flask
from flask_cors import CORS
import pandas as pd
import datetime
import time
from datetime import timedelta


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

cancel_1 = ex_1.query("MessageType == 'Cancelled'")
cancel_2 = ex_2.query("MessageType == 'Cancelled'")
cancel_3 = ex_3.query("MessageType == 'Cancelled'")


merged_orders_df = pd.concat([order_req_1,order_req_2,order_req_3], axis=0)
merged_df_sorted = merged_orders_df.sort_values(by='TimeStamp')
orders_df = merged_df_sorted.reset_index(drop=True)


order_dict = {'1': order_req_1, '2':order_req_2, '3':order_req_3}
sym_dict = {'1': sym_1, '2': sym_2, '3': sym_3}
cancel_dict = {'1': cancel_1, '2': cancel_2, '3': cancel_3}


# - Global Variables - #
index_symb = 0
temp_index_symb = 0
symb_temp = 'PRQ83'
time_start = next(iter(orders_df['TimeStamp'])).replace(second=0, microsecond=0)
symb_start_time = next(iter(orders_df['TimeStamp'])).replace(second=0, microsecond=0)
symb_period_end = next(iter(orders_df['TimeStamp'])).replace(second=0, microsecond=0)

app = Flask(__name__)


CORS(app)
@app.route('/')
def printInfo():
    print('Basic route')
   

@app.route('/get/<symbol>')
def get_symbol(symbol):
    global index_symb
    global time_start
    global symb_start_time
    global symb_period_end
    global symb_temp
    global temp_index_symb

    if (symb_temp == ''):
        symb_temp = symbol
        index_symb = 0
    elif (symb_temp != '' and symb_temp != symbol):
        symb_temp = symbol
        index_symb = 0
        symb_start_time = next(iter(orders_df['TimeStamp']))


    mask = orders_df['Symbol'] == symb_temp
    filtered_orders_df = orders_df[mask]
    filt_reset_orders_df = filtered_orders_df.reset_index(drop=True)

    # - Start time of the specified symbol - #
    
    if symb_start_time == next(iter(orders_df['TimeStamp'])):
        symb_start_time = next(iter(filt_reset_orders_df['TimeStamp']))
        delta = datetime.timedelta(milliseconds=100)
        symb_period_end = symb_start_time + delta
    elif temp_index_symb == index_symb:
        symb_start_time = symb_period_end
        delta = datetime.timedelta(milliseconds=100)
        symb_period_end = symb_start_time + delta
    
    in_range_timestamp = []

    for i in range(len(filt_reset_orders_df['TimeStamp'])):
        timestamp = filt_reset_orders_df['TimeStamp'][i]
        if symb_start_time <= timestamp <= symb_period_end:
            order_price = filt_reset_orders_df['OrderPrice'][i]
            time_str = timestamp.strftime("%H:%M:%S.%f")[:-3]
            in_range_timestamp.append([time_str, order_price])

    return in_range_timestamp

@app.route('/get_symbols/<Exchange>')
def get_symbols(Exchange):
    unique_symbols = set()

    if(Exchange == 'Exchange1'):
        for symbol in sym_dict['1']:
            if symbol not in unique_symbols:
                unique_symbols.add(symbol)
    elif Exchange == 'Exchange2':
        for symbol in sym_dict['2']:
            if symbol not in unique_symbols:
                unique_symbols.add(symbol)
    elif Exchange == 'Exchange3':
        for symbol in sym_dict['3']:
            if symbol not in unique_symbols:
                unique_symbols.add(symbol)
    
    # Convert the set back to a list
    unique_symbols_list = list(unique_symbols)
    
    return unique_symbols_list

@app.route('/set_time/')
def start_server():
    start = 1704464880 # 01/05/2024
    global delta
    delta = int(time.time()) - start
    print("delta ", delta)
    return str(start)

@app.route('/price_data/<exchange>/<symbol>/<prev_time>')
def upload_data(exchange, symbol, prev_time):
    global delta
    global volume
    prev_time = datetime.datetime.fromtimestamp(int(prev_time))
    curr_time = datetime.datetime.fromtimestamp(int(time.time()) - delta)
    s = order_dict[exchange].query(f"Symbol == '{symbol}'").query(f"TimeStampEpoch > '{prev_time}' and TimeStampEpoch <= '{curr_time}'")
    print("here")
    d = cancel_dict[exchange].query(f"Symbol == '{symbol}'").query(f"TimeStampEpoch > '{prev_time}' and TimeStampEpoch <= '{curr_time}'")
    
                             
    volume.update(set(s["OrderID"]))
    
    
    for id in volume:
        if not id in set(d["OrderID"]):
            print(id)
            
    volume -= set(d["OrderID"])
    #print(set(s["OrderID"]), set(d["OrderID"]))
    
    return [s["TimeStampEpoch"].to_list(), s["OrderPrice"].to_list(), len(volume)]

# @app.route('/stat_data/')
# def get_data():

if __name__ == '__main__':
    global delta
    global volume
    volume = set()
    app.debug = True
    app.run()
    