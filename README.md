Uniswap Liquidity exit

The following contract in the repo is used to exit the position by calling `decreaseLiquidity` on the uniswap contract.
But, there is a limitation with this approach.

1. The Uniswap contract can only allow for the owner of the Pool NFT to actually create the call to remove liquidity.
2. This doesn't allow for smart contract to create the call. We can override this by approving the contract to hold the NFT as a owner and remove the liquidity.

Now this is a hacky way to remove the liquidity. But not the preferred one. This works sometimes and doesn't due to some weird error of not getting approval of the NFT transfer on different chains. In terms of security, this option doesn't really work in long term as well cause the deployed contract holds the ownership of the NFT behalf of the person who created the liquidity.

Now, we can actually do this better in 3 ways.

1. We create a contract that actually creates the liquidity pool there by the contract becoming the owner of the pool NFT and pulling it out whenever required and tranferring it to the person who created the contract.
2. The sneaky thing hidden in the uniswap contract is `Permit`. Now there's not enough documentation on how to actually implement it but just technical information on how one can make use of it. With `Permit` we can achieve what we are looking for. The owner of the pool permits our contract to act on behalf of them and remove liquidity.
3. Using SDK. Now uniswap has SDKs already available where we can directly call `removeCallParameters` which we can trigger without having to actually create our own smart contracts. But, we need to keep in mind that we would still need Permit option here as well if we want to act on behalf of the owner of the pool.

So, the `Permit` option plays a really important role in how we can act on behalf of the pool owner. But unfortunately not much info on how to exactly use is available in uniswap docs.



