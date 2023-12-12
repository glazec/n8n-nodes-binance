[![npm version](https://badge.fury.io/js/n8n-nodes-binance.svg)](https://badge.fury.io/js/n8n-nodes-binance)
![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-binance

![](assets/example1.png)

The `n8n-nodes-binance` enhances your trading experience on Binance by automating spot trading activities. Utilize your Binance API key to access a variety of functions such as:
* Market Orders
* Limit Orders
* Buy/Sell Operations
* Time-in-Force Options

Incorporate this node into your workflow with caution, considering these crucial points:
* The Binance API does not permit calls from IP addresses in the US and other restricted countries.
* Your order price must align with the current order book. For instance, placing a $10 buy order for a token trading at $70 is not feasible.

This Binance plugin empowers you to construct a personalized trading bot. An example use case involves integrating the [Telegram node](https://docs.n8n.io/nodes/n8n-nodes-base.telegram/) to receive price alerts, followed by executing orders through the Binance node.

Furthermore, the plugin supports advanced strategies like TWAP (Time Weighted Average Price) orders and grid trading. Although Binance officially provides TWAP within 72-hour windows, our node enables extended applications, such as spreading Bitcoin purchases across a month, using workflows like the one illustrated below:
![](assets/example2.png)

# Install
You can install the community package on the n8n Web GUI, Settings -> Community nodes -> Install a community node, type "n8n-nodes-binance" in the input box.

You can find deailted installation guide at [n8n website](https://docs.n8n.io/integrations/community-nodes/installation/#install-a-community-node).
