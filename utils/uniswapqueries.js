const axios = require('axios');

const UNISWAP_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';
const TICK_BASE = 1.0001;

/**
 *
 * @param {*} id
 * @returns position information of the token id passed
 */
const getPositionForId = async (id) => {
	try {
		const query = `
        {
            positions(where: {id: ${id}}) {
                liquidity
                tickLower { tickIdx }
                tickUpper { tickIdx }
                pool { id }
                token0 {
                  symbol
                  decimals
                }
                token1 {
                  symbol
                  decimals
                }
              }
        }`;

		const result = await axios.post(
			UNISWAP_SUBGRAPH_URL,
			{ query },
			{
				headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
			}
		);

		if (result.data.data.positions.length > 0) {
			return result.data.data.positions[0];
		} else {
			return null;
		}
	} catch (err) {
		if (err.response) {
			console.log(err.response.data);
		} else {
			console.log(err);
		}
	}
};

/**
 *
 * @param {*} poolId
 * @returns return pool information for the pool id passed
 */
const getPoolForId = async (poolId) => {
	try {
		const stringPoolId = `"${poolId}"`;
		const query = `{
            pools(where: {id: ${stringPoolId}}) {
                token0 { id}
                token1 { id}
                       feeTier
                       tick
                       sqrtPrice
                   }
       }`;
		const result = await axios.post(
			UNISWAP_SUBGRAPH_URL,
			{ query },
			{
				headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
			}
		);
		if (result.data.data.pools.length > 0) {
			return result.data.data.pools[0];
		} else {
			return null;
		}
	} catch (err) {
		console.log(err);
	}
};

const getTickForPrice = (tick) => {
	return TICK_BASE ** tick;
};

//get impermanent loss for a position
const getImpermanentLoss = async (positionId) => {
	try {
		const position = await getPositionForId(positionId);

		const pool = await getPoolForId(position.pool.id);

		if (!position || !pool) {
			return null;
		} else {
			//Get the required data from the position and pool
			const position_liquidity = parseInt(position.liquidity);
			const position_tick_lower = parseInt(position.tickLower.tickIdx);
			const position_tick_upper = parseInt(position.tickUpper.tickIdx);
			const position_token0 = position.token0.symbol;
			const position_token1 = position.token1.symbol;
			const position_token0_decimals = parseInt(position.token0.decimals);
			const position_token1_decimals = parseInt(position.token1.decimals);

			let amount0, amount1, sa, sb;

			const current_tick = parseInt(pool.tick);
			const current_sqrt_price = parseInt(pool.sqrtPrice) / 2 ** 96;

			const current_price = getTickForPrice(current_tick);
			const adjusted_current_price = current_price / 10 ** (position_token1_decimals - position_token0_decimals);

			sa = getTickForPrice(position_tick_lower / 2);
			sb = getTickForPrice(position_tick_upper / 2);

			if (position_tick_upper <= current_tick) {
				amount0 = 0;
				amount1 = position_liquidity * (sb - sa);
			} else if (position_tick_lower < current_tick < position_tick_upper) {
				amount0 = (position_liquidity * (sb - current_sqrt_price)) / (current_sqrt_price * sb);
				amount1 = position_liquidity * (current_sqrt_price - sa);
			} else {
				amount0 = (position_liquidity * (sb - sa)) / (sa * sb);
				amount1 = 0;
			}

			const adjusted_amount0 = amount0 / 10 ** position_token0_decimals;
			const adjusted_amount1 = amount1 / 10 ** position_token1_decimals;

			console.log(
				`Your position is ${adjusted_amount0} ${position_token0} and ${adjusted_amount1} ${position_token1} in the pool ${position.pool.id} in the range [${position_tick_lower}, ${position_tick_upper}]`
			);

			if (adjusted_amount0 > adjusted_amount1) {
				return adjusted_amount1 / adjusted_amount0;
			} else if (adjusted_amount1 > adjusted_amount0) {
				return adjusted_amount0 / adjusted_amount1;
			} else {
				return 0;
			}
		}
	} catch (err) {
		console.log(err);
	}
};

module.exports = {
	getImpermanentLoss,
};
