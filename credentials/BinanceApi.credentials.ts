import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class BinanceApi implements ICredentialType {
	name = 'binanceApi';
	displayName = 'Binace API';
	documentationUrl = 'https://github.com/glazec/n8n-nodes-binance';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'binanceApiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API Key for binance',
		},
		{
			displayName: 'Secret Key',
			name: 'binanceSecretKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API Seceret for binance',
		},
	];
	// test(request: ICredentialTestRequest): Promise<IAuthenticateGeneric> {
	// 	// @ts-ignore
	// 	const { privateKey } = request.credentials;
	// 	const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`);
	// 	const account = web3.eth.accounts.privateKeyToAccount(privateKey);
	// 	return Promise.resolve({ success: true, message: 'Authentication successful' });
	// }
}
