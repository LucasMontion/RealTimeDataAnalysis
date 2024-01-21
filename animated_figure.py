from dash import Dash, dcc, html, Input, Output, callback, State
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
from datetime import datetime, timedelta
import numpy as np


ex_1 = pd.read_json("nbc_data/Exchange_1.json")
ex_2 = pd.read_json("nbc_data/Exchange_2.json")
ex_3 = pd.read_json("nbc_data/Exchange_3.json")

total_df = pd.concat([ex_1, ex_2, ex_3])

start_time = datetime(2024, 1, 5, 9, 29, 59)
end_time = datetime(2024, 1, 5, 9, 32)

global curr_time 
curr_time = datetime(2024, 1, 5, 9, 29, 59)

print(start_time+timedelta(0, 1))

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
print(len(s))
# for symbol in sym_1:
#     print(symbol)
#     s = order_req_1.query(f"Symbol == '{symbol}'")
#     for i in range(len(s)):
#         #print(s.iloc[:6])
#         fig = px.scatter(s, y="OrderPrice", x="TimeStampEpoch")
#         fig.show()
#     break

# Base plot
# fig = go.Figure(
#     layout=go.Layout(
#         updatemenus=[dict(type="buttons", direction="right", x=0.9, y=1.16), ],
#         xaxis=dict(range=[start_time, end_time],
#                    autorange=False, tickwidth=2,
#                    title_text="Time"),
#         yaxis=dict(range=[0, s.OrderPrice.max()],
#                    autorange=False,
#                    title_text="Price"),
#         title="Symbol1",
#     ))

# Add traces
init = 1

# fig.add_trace(
#     go.Scatter(x=s.TimeStampEpoch[:init],
#                y=s.OrderPrice[:init],
#                name="price",
#                line=None,
#                visible=True
#                ))



# td = 1
# curr_time = start_time
# fig.update(frames=[
#     go.Frame(
#         data=[go.Scatter(x=s.query(f"TimeStampEpoch < '{start_time + timedelta(0, k*td)}'")["TimeStampEpoch"], 
#                          y=s.query(f"TimeStampEpoch < '{start_time + timedelta(0, k*td)}'")["OrderPrice"], 
#                          line=None)]
#     )
#     for k in range(init, int(240//td))])

# fig.update_xaxes(ticks="outside", tickwidth=2, tickcolor='white', ticklen=10)
# fig.update_yaxes(ticks="outside", tickwidth=2, tickcolor='white', ticklen=1)
# fig.update_layout(yaxis_tickformat=',')
# fig.update_layout(legend=dict(x=0, y=1.1), legend_orientation="h")

# # Buttons
# fig.update_layout(
#     updatemenus=[
#         dict(
#             buttons=list([
#                 dict(label="Play",
#                         method="animate",
#                     args=[None, {"frame": {"duration": td*1000}}])
#             ]))])

#fig.show()
td = 75
app = Dash(__name__)

app.layout = html.Div([
    dcc.Graph(
        id='graph'),
    dcc.Interval(id='interval', interval=td, max_intervals=-1),
    dcc.Store(id='index', data=0),
    dcc.Store(id='curr_time', data=start_time)
])

@callback(
    Output('graph', 'figure'),
    Output('index', 'data'),
    #Output('curr_time', 'data'),
    Input('interval', 'n_intervals'),
    State('index', 'data')
    #State('curr_time', 'data')
    )
def update(n_intervals, ind):
    #filtered_df = s[s["TimeStampEpoch"] <= start_time+timedelta(milliseconds=n_intervals*td)]
    curr_time = start_time + timedelta(milliseconds=td*n_intervals)
    #print(curr_time)
    while(s.iloc[ind].TimeStampEpoch < curr_time):
        ind += 1
    fig = px.scatter(s[:ind], x="TimeStampEpoch", y="OrderPrice", range_x=[start_time, end_time], title = str(curr_time))

    return fig, ind


app.run_server(debug=True)
