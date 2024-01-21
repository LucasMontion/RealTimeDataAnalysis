from dash import Dash, dcc, html, Input, Output, callback, State
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
from datetime import datetime, timedelta
import numpy as np


ex_1 = pd.read_json("nbc_data/Exchange_1.json")
ex_2 = pd.read_json("nbc_data/Exchange_2.json")
ex_3 = pd.read_json("nbc_data/Exchange_3.json")

cancel_1 = ex_1.query("MessageType == 'Cancelled'")
cancel_2 = ex_2.query("MessageType == 'Cancelled'")
cancel_3 = ex_3.query("MessageType == 'Cancelled'")

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

order_dict = {'1': order_req_1, '2':order_req_2, '3': order_req_3}
sym_dict = {'1': sym_1, '2': sym_2, '3': sym_3}
cancel_dict = {'1': cancel_1, '2': cancel_2, '3': cancel_3}

total_df = pd.concat([ex_1, ex_2, ex_3])

start_time = datetime(2024, 1, 5, 9, 28)
end_time = datetime(2024, 1, 5, 9, 32)

global curr_time 
curr_time = start_time

sym_1 = ex_1["Symbol"].value_counts().keys().tolist()
sym_2 = ex_2["Symbol"].value_counts().keys().tolist()
sym_3 = ex_3["Symbol"].value_counts().keys().tolist()

order_req_1 = ex_1.query("MessageType == 'NewOrderRequest'")
order_ac_1 = ex_1.query("MessageType == 'NewOrderAcknowledged'")
order_req_2 = ex_2.query("MessageType == 'NewOrderRequest'")
order_ac_2 = ex_2.query("MessageType == 'NewOrderAcknowledged'")
order_req_3 = ex_3.query("MessageType == 'NewOrderRequest'")
order_ac_3 = ex_3.query("MessageType == 'NewOrderAcknowledged'")

print("processing done")

s = order_req_1.query(f"Symbol == '{sym_1[0]}'")

global td
td = 200
app = Dash(__name__)

app.layout = html.Div([
    dcc.Interval(id='interval', interval=td, max_intervals=-1),
    html.H1("Price vs Time"),
    html.Div([
        dcc.Dropdown(sym_1, sym_1[0], id='symbol1'),
        dcc.Graph(
            id='graph1'),
        
        dcc.Store(id='index1', data=0),
    ]),
    html.Div([
        dcc.Dropdown(sym_2, sym_2[0], id='symbol2'),
        dcc.Graph(
            id='graph2'),
        
        dcc.Store(id='index2', data=0),
    ]),
    html.Div([
        dcc.Dropdown(sym_3, sym_3[0], id='symbol3'),
        dcc.Graph(
            id='graph3'),
        
        dcc.Store(id='index3', data=0),
    ]),
    html.Div([
        dcc.RadioItems(
            id='exchange',
            options=['Exchange 1', 'Exchange 2', 'Exchange 3'],
            value='Exchange 2',
        ),
        dcc.Loading(dcc.Graph(id="bubble_graph"))
    ])
])

# @callback(
#     Output('graph1', 'figure'),
#     Output('index1', 'data'),
#     Input('interval', 'n_intervals'),
#     Input('symbol1', 'value'),
#     State('index1', 'data')
#     )
# def update_1(n_intervals, symbol, ind):
#     s = order_req_1.query(f"Symbol == '{symbol}'")
#     global curr_time
#     curr_time = curr_time + timedelta(milliseconds=200)
#     while(ind < len(s) and s.iloc[ind].TimeStampEpoch < curr_time):
#         ind += 1
#     s["MA"] = s["OrderPrice"].rolling(5).mean()
#     fig = make_subplots(rows=2, cols=1)
#     fig.append_trace(go.Scatter(x=s[:ind]["TimeStampEpoch"], y=s[:ind]["OrderPrice"]), row=1, col=1)
#     fig.append_trace(go.Scatter(x=s[:ind]["TimeStampEpoch"], y=s[:ind]["MA"]), row=2, col=1)

#     return fig, ind

# @callback(
#     Output('graph2', 'figure'),
#     Output('index2', 'data'),
#     Input('interval', 'n_intervals'),
#     Input('symbol2', 'value'),
#     State('index2', 'data')
#     )
# def update_2(n_intervals, symbol, ind):
#     s = order_req_2.query(f"Symbol == '{symbol}'")
#     global curr_time
#     curr_time = curr_time + timedelta(milliseconds=200)
    
#     s["MA"] = s["OrderPrice"].rolling(5).mean()
#     while(ind < len(s) and s.iloc[ind].TimeStampEpoch < curr_time):
#         ind += 1
#     fig = px.scatter(s[:ind], x="TimeStampEpoch", y="OrderPrice", range_x=[start_time, end_time], title = str(curr_time),
#                      labels = {"OrderPrice":"Price", "TimeStampEpoch":"Time"})
#     #fig = px.plot(s[:ind], x="TimeStampEpoch", y="OrderPrice", range_x=[start_time, end_time])

#     return fig, ind

# @callback(
#     Output('graph3', 'figure'),
#     Output('index3', 'data'),
#     Input('interval', 'n_intervals'),
#     Input('symbol3', 'value'),
#     State('index3', 'data')
#     )
# def update_3(n_intervals, symbol, ind):
#     s = order_req_3.query(f"Symbol == '{symbol}'")
#     global curr_time
#     curr_time = curr_time + timedelta(milliseconds=200)    
#     while(ind < len(s)  and s.iloc[ind].TimeStampEpoch < curr_time):
#         ind += 1
#     fig = px.scatter(s[:ind], x="TimeStampEpoch", y="OrderPrice", range_x=[start_time, end_time], title = str(curr_time),
#                      labels = {"OrderPrice":"Price", "TimeStampEpoch":"Time"})

#     return fig, ind

@callback(
    Output('bubble_graph', 'figure'), 
    Input('exchange', 'value')
)
def bubble(ex):
    df = pd.read_csv("nbc_data/e2_cpp.csv")
    #df.index = np.arange(len(df))
    
    print(df.dtypes)
    df.columns = ["Symbol","Time", "std", "mean", "max", "min", "spread", "wtv"]
   
    #df["TimeStamp"] = pd.to_datetime(df["Time"])
    
    #print(df)
    fig = px.scatter(df, x = "Time", y = "max", 
                     animation_group="Symbol", 
                     animation_frame="Time", 
                     size="max",
                     #range_x=[df["spread"].min(), df["spread"].max()],
                     range_y=[df["max"].min(), df["max"].max()],
                     log_x=False)
    
    return fig

app.run_server(debug=True)
