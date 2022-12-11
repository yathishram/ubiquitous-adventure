const contract_address = '0xc0C1B2D8a0a8508Baf3301a47629c9A8ca32506D';
const abi = [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'approvePosition',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'deposits',
		outputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'uint128',
				name: 'liquidity',
				type: 'uint128',
			},
			{
				internalType: 'address',
				name: 'token0',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'token1',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'exitLiquidity',
		outputs: [
			{
				internalType: 'uint256',
				name: 'amount0',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'amount1',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'getApprovedOwner',
		outputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'getDepositForTokenId',
		outputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'owner',
						type: 'address',
					},
					{
						internalType: 'uint128',
						name: 'liquidity',
						type: 'uint128',
					},
					{
						internalType: 'address',
						name: 'token0',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'token1',
						type: 'address',
					},
				],
				internalType: 'struct UniswapExit.Deposit',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'getPosition',
		outputs: [
			{
				internalType: 'uint128',
				name: 'liquidity',
				type: 'uint128',
			},
			{
				internalType: 'address',
				name: 'token0',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'token1',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'nonfungiblePositionManager',
		outputs: [
			{
				internalType: 'contract INonfungiblePositionManager',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'nonfungiblePositionManagerAddress',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
			{
				internalType: 'bytes',
				name: '',
				type: 'bytes',
			},
		],
		name: 'onERC721Received',
		outputs: [
			{
				internalType: 'bytes4',
				name: '',
				type: 'bytes4',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
];

// export { contract_address, abi };
module.exports = { contract_address, abi };
