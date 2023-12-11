import axios, { AxiosResponse } from 'axios';
import { ethers } from 'ethers';
export async function oneInchSwap(
	inTokenAddress: string,
	outTokenAddress: string,
	amount: string,
	privateKey: string,
	rpcAddress: string,
	chainId: string,
	slippage: string,
) {
	inTokenAddress = ethers.getAddress(inTokenAddress);
	outTokenAddress = ethers.getAddress(outTokenAddress);
	inTokenAddress = inTokenAddress.toLowerCase();
	outTokenAddress = outTokenAddress.toLowerCase();
	let allowanceResponse: AxiosResponse<any> | undefined;
	var allowanceTxResponse: AxiosResponse<any> | undefined;
	var swapTxResponse: AxiosResponse<any> | undefined;
	const provider = ethers.getDefaultProvider(rpcAddress);
	const wallet = new ethers.Wallet(privateKey, provider);
	var spenderAddressTx;
	var spenderAddress;
	//  get spender
	// make get request to /v5.0/42161/approve/spender
	try {
		spenderAddressTx = await axios.get('https://api.1inch.io/v5.0/' + chainId + '/approve/spender');
		spenderAddress = spenderAddressTx.data.address;
		console.log(spenderAddress);
	} catch (error) {
		console.error(error);
		throw new Error('Bad response from 1inch spender API. See console for more details');
	}
	// get allowance
	// wallet Address
	// /v5.0/42161/approve/allowance
	try {
		allowanceResponse = await axios.get(
			'https://api.1inch.io/v5.0/' +
				chainId +
				'/approve/allowance?tokenAddress=' +
				inTokenAddress +
				'&walletAddress=' +
				wallet.address.toLowerCase(),
		);
	} catch (error) {
		console.error(error);
		throw new Error('Bad response from 1inch approve API. See console for more details');
	}
	if (!allowanceResponse) {
		throw new Error('No response from 1inch approve API');
	}
	if (parseInt(allowanceResponse.data.allowance) < parseInt(amount)) {
		try {
			allowanceTxResponse = await axios.get(
				'https://api.1inch.io/v5.0/' +
					chainId +
					'/approve/transaction?tokenAddress=' +
					inTokenAddress +
					'&amount=' +
					amount,
			);
		} catch (error) {
			console.error(error);
			throw new Error('Bad response from 1inch allowance tx API. See console for more details');
		}
		if (!allowanceTxResponse) {
			console.error('No response from 1inch allowance tx API');
			return; // return early or throw an error
		}
		console.log(allowanceTxResponse.data);
		const simulateApproveResult = await wallet.call({
			to: allowanceTxResponse.data.to,
			data: allowanceTxResponse.data.data,
		});
		console.log(simulateApproveResult);
		const approveResult = await wallet.sendTransaction({
			to: allowanceTxResponse.data.to,
			data: allowanceTxResponse.data.data,
		});
		console.log(approveResult);
	}
	// get swap tx body
	try {
		swapTxResponse = await axios.get(
			'https://api.1inch.io/v5.0/' +
				chainId +
				'/swap?fromTokenAddress=' +
				inTokenAddress +
				'&toTokenAddress=' +
				outTokenAddress +
				'&amount=' +
				amount +
				'&fromAddress=' +
				wallet.address.toLowerCase() +
				'&slippage=' +
				slippage,
		);
	} catch (error) {
		console.error(error);
		throw new Error('Bad response from 1inch swap tx API. See console for more details');
	}
	if (!swapTxResponse) {
		console.error('No response from  1inch swap tx API');
		return; // return early or throw an error
	}
	console.log(swapTxResponse.data);

	const simulateSwapResult = await wallet.call({
		to: swapTxResponse.data.tx.to,
		data: swapTxResponse.data.tx.data,
	});
	console.log('==Simulation Finished==');
	console.log(simulateSwapResult);
	console.log('==Send Swap Tx==');
	var swapResult;

	swapResult = await wallet.sendTransaction({
		to: swapTxResponse.data.tx.to,
		data: swapTxResponse.data.tx.data,
	});
	console.log(swapResult);
	// ethers.js bigint to string

	return {
		hash: swapResult.hash,
		chainId: ethers.toNumber(swapResult.chainId).toString(),
		to: swapResult.to,
		from: swapResult.from,
		nonce: ethers.toNumber(swapResult.nonce).toString(),
		gasLimit: ethers.toNumber(swapResult.gasLimit).toString(),
		value: ethers.toNumber(swapResult.value).toString(),
	};
}
