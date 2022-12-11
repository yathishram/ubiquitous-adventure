const { ethers } = require('hardhat');

async function main() {
	const UniswapExit = await ethers.getContractFactory('UniswapExit');
	const uniswapExit = await UniswapExit.deploy();

	await uniswapExit.deployed();

	console.log('UniswapExit deployed to:', uniswapExit.address);

	//get positionInfo

	const positionInfo = await uniswapExit.getPosition(7083);
	console.log(positionInfo);

	//give access to onERC721Received
	const tx = await uniswapExit.onERC721Received(
		'0x484f744e6AEF1152CFfd03177962b23dE488c58D',
		'0x484f744e6AEF1152CFfd03177962b23dE488c58D',
		7083,
		ethers.constants.HashZero,
		{
			gasLimit: 1000000,
		}
	);
	const receipt = await tx.wait();
	console.log(receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
