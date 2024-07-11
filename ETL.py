import pandas as pd
from OrderDetails import OrderDetails



ex_1 = pd.read_json("nbc_data/Exchange_1.json")
ex_2 = pd.read_json("nbc_data/Exchange_2.json")
ex_3 = pd.read_json("nbc_data/Exchange_3.json")

df = pd.concat([ex_1, ex_2, ex_3])
df = df.sort_values(by='TimeStamp')
df = df.reset_index(drop=True)

sym_exc_1 = ex_1["Symbol"].value_counts().keys().tolist()
sym_exc_2 = ex_2["Symbol"].value_counts().keys().tolist()
sym_exc_3 = ex_3["Symbol"].value_counts().keys().tolist()

symbol_list = [sym_exc_1, sym_exc_2, sym_exc_3]


order_req_1 = ex_1.query("MessageType == 'NewOrderRequest'")
order_req_2 = ex_2.query("MessageType == 'NewOrderRequest'")
order_req_3 = ex_3.query("MessageType == 'NewOrderRequest'")

order_ac_1 = ex_1.query("MessageType == 'NewOrderAcknowledged'")
order_ac_2 = ex_2.query("MessageType == 'NewOrderAcknowledged'")
order_ac_3 = ex_3.query("MessageType == 'NewOrderAcknowledged'")

order_can_req_1 = ex_1.query("MessageType == 'CancelRequest'")
order_can_req_2 = ex_2.query("MessageType == 'CancelRequest'")
order_can_req_3 = ex_3.query("MessageType == 'CancelRequest'")

order_can_ac_1 = ex_1.query("MessageType == 'CancelAcknowledged'")
order_can_ac_2 = ex_2.query("MessageType == 'CancelAcknowledged'")
order_can_ac_3 = ex_3.query("MessageType == 'CancelAcknowledged'")

cancel_1 = ex_1.query("MessageType == 'Cancelled'")
cancel_2 = ex_2.query("MessageType == 'Cancelled'")
cancel_3 = ex_3.query("MessageType == 'Cancelled'")

order_dict = {'1': order_req_1, '2':order_req_2, '3':order_req_3}
cancel_dict = {'1': cancel_1, '2': cancel_2, '3': cancel_3}

merged_orders_df = pd.concat([order_req_1,order_req_2,order_req_3], axis=0)
merged_df_sorted = merged_orders_df.sort_values(by='TimeStamp')
orders_req_df = merged_df_sorted.reset_index(drop=True)

merged_orders_ack_df = pd.concat([order_ac_1,order_ac_2,order_ac_3], axis=0)
sorted_orders_ack_df = merged_orders_ack_df.sort_values(by='TimeStamp')
orders_ack_df = sorted_orders_ack_df.reset_index(drop=True)

#order_book = []


#for i in range(len(orders_req_df)):
    #order = orders_ack_df[orders_ack_df['OrderID'].str.contains(orders_req_df['OrderID'][i]) == True]

    #print(i)
    #print('is equal: ')
    #print(orders_ack_df['OrderID'][i] == orders_req_df['OrderID'][i])

    #if (order['OrderID'] == orders_req_df['OrderID'][i]).bool():
    #    order_book.append(OrderDetails(orders_req_df['TimeStamp'][i], orders_req_df['TimeStampEpoch'][i], orders_req_df['Direction'][i], orders_req_df['OrderID'][i], orders_req_df['MessageType'][i], orders_req_df['Symbol'][i], orders_req_df['OrderPrice'][i], orders_req_df['Exchange'][i]))
        

# Merge DataFrames on 'OrderID'
merged_df = pd.merge(orders_req_df, orders_ack_df, on='OrderID', suffixes=('_req', '_ack'))

# Create the list of OrderDetails using a list comprehension
order_book = [
    OrderDetails(row['TimeStamp_req'], row['TimeStampEpoch_req'], row['Direction_req'], row['OrderID'], row['MessageType_req'], row['Symbol_req'], row['OrderPrice_req'], row['Exchange_req'])
    for index, row in merged_df.iterrows()
]


