import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
const { Spot } = require('@binance/connector');

async function trade(
	symbol: string,
	side: string,
	type: string,
	timeInForce: string,
	quantity: number,
	price: number,
	apiKey: string,
	apiSecret: string,
): Promise<any> {
	const client = new Spot(apiKey, apiSecret);
	client.newOrder;
	try {
		const result = await client.newOrder(symbol, side, type, {
			timeInForce: timeInForce,
			quantity: quantity,
			price: price,
		});
		return result;
	} catch (error) {
		return error;
	}
}

export class Binance implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Binance',
		name: 'Binance',
		icon: 'file:BinanceLogo.svg',
		group: ['transform'],
		version: 1,
		description: 'Trade on Binance',
		defaults: {
			name: 'Binance',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'binanceApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Token Trading Pair',
				name: 'symbol',
				type: 'string',
				default: 'BTCUSDT',
				required: true,
				description: 'The token trading pair on Binance',
			},
			{
				displayName: 'Trade Side',
				name: 'side',
				type: 'options',
				default: 'BUY',
				options: [
					{ name: 'Buy', value: 'BUY' },
					{ name: 'Sell', value: 'SELL' },
				],
			},
			{
				displayName: 'Order Type',
				name: 'type',
				type: 'options',
				default: 'LIMIT',
				options: [
					{ name: 'Limit', value: 'LIMIT' },
					{ name: 'Market', value: 'MARKET' },
				],
			},
			{
				displayName: 'Time in Force',
				name: 'timeInForce',
				type: 'options',
				default: 'GTC',
				options: [
					{ name: 'Good Till Cancel', value: 'GTC' },
					{ name: 'Immediate or Cancel', value: 'IOC' },
					{ name: 'Fill or Kill', value: 'FOK' },
				],
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				description: 'The quantity of the order',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'number',
				default: 1,
				description: 'The price of the order',
			},
			// {
			// 	displayName: 'New Client Order ID',
			// 	name: 'newClientOrderId',
			// 	type: 'string',
			// 	default: '',
			// 	description: 'A unique id for the order. Automatically generated if not sent.',
			// },
			// {
			// 	displayName: 'Stop Price',
			// 	name: 'stopPrice',
			// 	type: 'number',
			// 	default: 1,
			// 	description: 'Used with STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT orders.',
			// },
			// {
			// 	displayName: 'Iceberg Quantity',
			// 	name: 'icebergQty',
			// 	type: 'number',
			// 	default: 1,
			// 	description: 'Used with LIMIT, STOP_LOSS_LIMIT, and TAKE_PROFIT_LIMIT to create an iceberg order.',
			// },
			// {
			// 	displayName: 'New Order Response Type',
			// 	name: 'newOrderRespType',
			// 	type: 'options',
			// 	default: 'ACK',
			// 	options: [
			// 		{ name: 'Acknowledge', value: 'ACK' },
			// 		{ name: 'Result', value: 'RESULT' },
			// 		{ name: 'Full', value: 'FULL' },
			// 	],
			// },
			// {
			// 	displayName: 'Receive Window',
			// 	name: 'recvWindow',
			// 	type: 'number',
			// 	default: 5000,
			// 	description: 'The number of milliseconds the request is valid for.',
			// },
			// }
		],
	};

	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const apiKey: string = (await this.getCredentials('binanceApi')).binanceApiKey as string;
		const secretKey: string = (await this.getCredentials('binanceApi')).binanceSecretKey as string;
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const returnData = [];
		for (let i = 0; i < items.length; i++) {
			// Get additional fields input
			const data: IDataObject = {
				symbol: (this.getNodeParameter('symbol', i) as string).toUpperCase(),
				side: this.getNodeParameter('side', i) as string,
				type: this.getNodeParameter('type', i) as string,
				timeInForce: this.getNodeParameter('timeInForce', i) as string,
				quantity: this.getNodeParameter('quantity', i) as number,
				price: this.getNodeParameter('price', i) as number,
			};
			Object.assign(data);
			let orderResult = await trade(
				data.symbol as string,
				data.side as string,
				data.type as string,
				data.timeInForce as string,
				data.quantity as number,
				data.price as number,
				apiKey,
				secretKey,
			);
			returnData.push({
				json: orderResult,
			});
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
