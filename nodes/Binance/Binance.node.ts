// @ts-nocheck
import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import axios from 'axios';
import { ethers } from 'ethers';
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
	const result = await client.newOrder(symbol, side, type, {
		timeInForce: timeInForce,
		quantity: quantity,
		price: price,
		baseURL: 'https://testnet.binance.vision',
	});
	return result.data;
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
			// {
			// 	displayName: 'Chain',
			// 	name: 'chainId',
			// 	type: 'options',
			// 	options: [
			// 		{ name: 'Ethereum', value: 1 },
			// 		{ name: 'Binance Smart Chain', value: 56 },
			// 		{ name: 'Polygon', value: 137 },
			// 		{ name: 'Optimism', value: 10 },
			// 		{ name: 'Arbitrum', value: 42161 },
			// 		{ name: 'Gnosis Chain', value: 100 },
			// 		{ name: 'Avalanche', value: 43114 },
			// 		{ name: 'Fantom', value: 250 },
			// 		{ name: 'Klaytn', value: 8217 },
			// 		{ name: 'Aurora', value: 1313161554 },
			// 	],
			// 	default: 1,
			// 	required: true,
			// 	description: 'The ID of the chain to send transactions to',
			// },
			// {
			// 	displayName: 'RPC Address',
			// 	name: 'rpcAddress',
			// 	type: 'string',
			// 	default: 'https://arbitrum-mainnet.infura.io/v3/6f00d07c00804205a7dae7f8d4f75fcc',
			// 	required: true,
			// 	description: 'The RPC address to send transactions to',
			// },
			// {
			// 	// USDT Address on Arbitrum
			// 	displayName: 'Input Token Address',
			// 	name: 'inputTokenAddress',
			// 	type: 'string',
			// 	default: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
			// 	required: true,
			// 	description: 'The address of the token to send transactions to',
			// },
			// {
			// 	// DAI Address on Arbitrum
			// 	displayName: 'Output Token Address',
			// 	name: 'outputTokenAddress',
			// 	type: 'string',
			// 	default: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
			// 	required: true,
			// 	description: 'Whether to output the token address as a string',
			// },
			// {
			// 	displayName: 'Input Token Amount',
			// 	name: 'inputTokenAmount',
			// 	type: 'number',
			// 	default: 100,
			// 	required: true,
			// 	description: 'The amount of input token to send. Notice the decimals.',
			// },
			// {
			// 	displayName: 'Slippage',
			// 	name: 'slippage',
			// 	type: 'number',
			// 	default: 1,
			// 	required: true,
			// 	description: 'Min: 0; max: 50',
			// },
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
		const apiKey = (await this.getCredentials('binanceApi')).binanceApiKey;
		const secretKey = (await this.getCredentials('binanceApi')).binanceSecretKey;
		// Handle data coming from previous nodes
		const items = this.getInputData();
		let responseData;
		const returnData = [];
		for (let i = 0; i < items.length; i++) {
			// Get additional fields input
			const data: IDataObject = {
				symbol: this.getNodeParameter('symbol', i) as string,
				side: this.getNodeParameter('side', i) as string,
				type: this.getNodeParameter('type', i) as string,
				timeInForce: this.getNodeParameter('timeInForce', i) as string,
				quantity: this.getNodeParameter('quantity', i) as number,
				price: this.getNodeParameter('price', i) as number,
			};
			Object.assign(data);
			let orderResult = await trade(
				data.symbol,
				data.side,
				data.type,
				data.timeInForce,
				data.quantity,
				data.price,
				apiKey,
				secretKey,
			);
			print(orderResult);
			returnData.push({
				json: orderResult,
			});

			// Map data to n8n data structure
			return [this.helpers.returnJsonArray(returnData)];
		}
	}
}
