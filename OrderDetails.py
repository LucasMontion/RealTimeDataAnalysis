class OrderDetails:
  def __init__(self, timeStamp, timeStampEpoch, direction, orderID, messageType, symbol, orderPrice, exchange):
    self.timeStamp = timeStamp
    self.timeStampEpoch = timeStampEpoch
    self.direction = direction
    self.orderID = orderID
    self.messageType = messageType
    self.symbol = symbol
    self.orderPrice = orderPrice
    self.exchange = exchange