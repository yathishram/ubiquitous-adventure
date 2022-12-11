// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "hardhat/console.sol";

contract UniswapExit is IERC721Receiver {
    address public nonfungiblePositionManagerAddress =
        0xC36442b4a4522E871399CD717aBDD847Ab11FE88;

    INonfungiblePositionManager public immutable nonfungiblePositionManager;

    struct Deposit {
        address owner;
        uint128 liquidity;
        address token0;
        address token1;
    }

    mapping(uint256 => Deposit) public deposits;

    constructor() {
        nonfungiblePositionManager = INonfungiblePositionManager(
            nonfungiblePositionManagerAddress
        );
    }

    /**
     * To deposit the NFT info in the contract
     */
    function _createDeposit(address owner, uint256 tokenId) internal {
        (
            ,
            ,
            address token0,
            address token1,
            ,
            ,
            ,
            uint128 liquidity,
            ,
            ,
            ,

        ) = nonfungiblePositionManager.positions(tokenId);
        // set the owner and data for position
        deposits[tokenId] = Deposit({
            owner: owner,
            liquidity: liquidity,
            token0: token0,
            token1: token1
        });
    }

    /**
     * To receive the NFT from the user
     */
    function onERC721Received(
        address operator,
        address,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        _createDeposit(operator, tokenId);
        return this.onERC721Received.selector;
    }

    //approve the contract to use the operator in the position
    function approvePosition(uint256 tokenId) external {
        nonfungiblePositionManager.approve(address(this), tokenId);
    }

    /**
     * To exit the liquidity from the position
     */
    function exitLiquidity(
        uint256 tokenId
    ) external returns (uint256 amount0, uint256 amount1) {
        uint128 liquidity = deposits[tokenId].liquidity;

        INonfungiblePositionManager.DecreaseLiquidityParams
            memory params = INonfungiblePositionManager
                .DecreaseLiquidityParams({
                    tokenId: tokenId,
                    liquidity: liquidity,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: block.timestamp
                });

        (amount0, amount1) = nonfungiblePositionManager.decreaseLiquidity(
            params
        );

        console.log("amount 0", amount0);
        console.log("amount 1", amount1);

        _sendToOwner(tokenId, amount0, amount1);
    }

    /**
     * To send the fees to the owner
     */
    function _sendToOwner(
        uint256 tokenId,
        uint256 amount0,
        uint256 amount1
    ) private {
        // get owner of contract
        address owner = deposits[tokenId].owner;

        address token0 = deposits[tokenId].token0;
        address token1 = deposits[tokenId].token1;
        // send collected fees to owner
        TransferHelper.safeTransfer(token0, owner, amount0);
        TransferHelper.safeTransfer(token1, owner, amount1);
    }

    /**
     * ------------------------------------------------------------------------------------------------
     */

    /**
     * Getting the deposit info for a tokenId
     */
    function getDepositForTokenId(
        uint256 tokenId
    ) external view returns (Deposit memory) {
        return deposits[tokenId];
    }

    /**
     * Getting the position info for a tokenId
     */
    function getPosition(
        uint256 tokenId
    )
        external
        view
        returns (
            uint128 liquidity,
            address token0,
            address token1,
            address owner
        )
    {
        (
            ,
            address operator,
            address token0,
            address token1,
            ,
            ,
            ,
            uint128 liquidity,
            ,
            ,
            ,

        ) = nonfungiblePositionManager.positions(tokenId);

        return (liquidity, token0, token1, operator);
    }

    function getApprovedOwner(
        uint256 tokenId
    ) external view returns (address owner) {
        owner = nonfungiblePositionManager.getApproved(tokenId);
    }
}
