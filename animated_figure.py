from dash import Dash, dcc, html, Input, Output
#import plotly.express as px
#import plotly.graph_objects as go
import pandas as pd


ex_1 = pd.read_json("nbc_data/Exchange_1.json")
ex_2 = pd.read_json("nbc_data/Exchange_2.json")
ex_3 = pd.read_json("nbc_data/Exchange_3.json")

print("1")
total_df = pd.concat([ex_1, ex_2, ex_3])

sym_1 = ex_1["Symbol"].to_list()

print(sym_1)

#fig = px.scatter(ex_1, y="OrderPrice", x="TimeStamp")

#fig.show()

#app = Dash(__name__)


# app.layout = html.Div([
#     html.H4('Animated GDP and population over decades'),
#     #html.P("Select an animation:"),
#     # dcc.RadioItems(
#     #     id='selection',
#     #     options=["GDP - Scatter", "Population - Bar"],
#     #     value='GDP - Scatter',
#     # ),
#     dcc.Loading(dcc.Graph(id="graph"), type="cube")
# ])


# @app.callback(
#     Output("graph"),
#     Input())
# def display_animated_graph():
#     #df = px.data.gapminder()  # replace with your own data source
#     ex_1 = pd.read_json("nbc_data/Exchange_1.json")
#     animations = {
#         'Price scatter': px.scatter(ex_1, x="OrderPrice", animation_frame="TimeStamp")
#     }
#     return animations['Price scatter']


# app.run_server(debug=True)
