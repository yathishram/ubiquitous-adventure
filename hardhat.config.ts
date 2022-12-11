require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: '.env' });

const privateKey = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	networks: {
		mumbai: {
			url: 'https://polygon-mumbai.g.alchemy.com/v2/1IrhhhqnUlyA-gBzHb_hNY5GA4LREPMl',
			accounts: [privateKey],
		},
		goerli: {
			url: 'https://eth-goerli.g.alchemy.com/v2/qh_OWXWi79i_A7WlWRKz7ZoX1H6HAX6b',
			accounts: [privateKey],
		},
	},

	solidity: {
		version: '0.7.6',
		settings: {
			optimizer: {
				runs: 200,
				enabled: true,
			},
		},
	},
};
