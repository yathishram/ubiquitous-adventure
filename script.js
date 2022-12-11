const { ethers } = require('ethers');
const { contract_address, abi } = require('./lib/contract_constants');
//dotenv.config();
require('dotenv').config();
//import dotenv from 'dotenv';
const { getImpermanentLoss } = require('./utils/uniswapqueries');
const cron = require('node-cron');
const { NonfungiblePositionManager } = require('@uniswap/v3-sdk');
// import { Pool, Position, NonfungiblePositionManager, nearestUsableTick } from '@uniswap/v3-sdk';
// import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
// import { Token } from '@uniswap/sdk-core';

const exitLiquidity = async (tokenId) => {
	console.log(process.env.PRIVATE_KEY);
	const provider = new ethers.providers.JsonRpcProvider(
		'https://polygon-mumbai.g.alchemy.com/v2/1IrhhhqnUlyA-gBzHb_hNY5GA4LREPMl'
	);
	const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

	const UniswapExit = new ethers.Contract(contract_address, abi, signer);

	const contractData = await UniswapExit.getDepositForTokenId(tokenId);
	console.log(contractData);

	const { calldata, value } = NonfungiblePositionManager.safeTransferFromParameters({
		sender: '0x484f744e6AEF1152CFfd03177962b23dE488c58D',
		recipient: contract_address,
		tokenId: tokenId,
	});
	console.log(calldata);
	console.log(value);

	const tx = await UniswapExit.exitLiquidity(tokenId, {
		gasLimit: 1000000,
	});
	const receipt = await tx.wait();
	console.log(receipt);
};

// exitLiquidity(7083)
// 	.then((res) => {
// 		console.log(res);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

cron.schedule('* * * * *', function () {
	getImpermanentLoss(7083)
		.then((impermanentLossRatio) => {
			if (impermanentLossRatio > 0.5) {
				console.log('Impermanent loss is too high!');
				console.log('Triggering smart contract to close position');
				exitLiquidity(7083)
					.then((res) => {
						console.log(res);
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				console.log('Impermanent loss is low enough!');
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

// another way of removing liquidity using the sdk
// const removeLiquidityWithSdk = async () => {
// 	const provider = new ethers.providers.JsonRpcProvider(
// 		'https://eth-goerli.g.alchemy.com/v2/qh_OWXWi79i_A7WlWRKz7ZoX1H6HAX6b'
// 	);
// 	const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 	const poolAddress = '0x4cff90f02897259e1ab69ff6bbd370ea14529bd8'

// 	const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)

// 	const immutables = {
// 		factory: await poolContract.factory(),
// 		token0: await poolContract.token0(),
// 		token1: await poolContract.token1(),
// 		fee: await poolContract.fee(),
// 		tickSpacing: await poolContract.tickSpacing(),
// 		maxLiquidityPerTick: await poolContract.maxLiquidityPerTick(),
// 	}

// 	const slot = await poolContract.slot0()

// 	const poolState = {
// 		liquidity: await poolContract.liquidity(),
// 		sqrtPriceX96: slot[0],
// 		tick: slot[1],
// 		observationIndex: slot[2],
// 		observationCardinality: slot[3],
// 		observationCardinalityNext: slot[4],
// 		feeProtocol: slot[5],
// 		unlocked: slot[6],
// 	}

// 	const token_1 = new Token(1, immutables.token0, 18)
// 	const token_2 = new Token(1, immutables.token1, 18)

// 	const block = await provider.getBlock(provider.getBlockNumber())
// 	const deadline = block.timestamp + 200

// 	const pool = new Pool(
// 		token_1,
// 		token_2,
// 		immutables.fee,
// 		poolState.sqrtPriceX96.toString(),
// 		poolState.liquidity.toString(),
// 		poolState.tick
// 	)

// 	const { calldata, value } = NonfungiblePositionManager.removeCallParameters(position, {
// 		tokenId: 1,
// 		liquidityPercentage: new Percent(1),
// 		slippageTolerance: new Percent(50, 10_000),
// 		deadline: deadline,
// 		collectOptions: {
// 		  expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(DAI, 0),
// 		  expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(USDC, 0),
// 		  recipient: sender,
// 		},
// 	  })
// }
