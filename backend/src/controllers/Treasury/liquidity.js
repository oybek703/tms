const asyncMiddleware = require('../../utils/async')
const getLiquidityTable = require("../../utils/liquidity")

// @desc Get liquidity
// @route /api/liquidity
// access Private
exports.getLiquidity = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const liquidityTable = await getLiquidityTable(date)
    res.status(200).json({success: true, rows: liquidityTable})
})

// @desc Get liquidity current state
// @route /api/liquidity/current_state
// access Private
exports.getLiquidityCurrentState = asyncMiddleware(async (req, res) => {
    const currentStateTable = await getLiquidityTable(new Date(), true)
    res.status(200).json({success: true, rows: currentStateTable})
})

