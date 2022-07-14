const asyncMiddleware = require('../../utils/async')
const getTopDepositsTable = require("../../utils/topDeposits")

// @desc Get Top Deposits
// @route /api/topdeposits
// access Private
exports.getTopDeposits = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const topDepositsTable = await getTopDepositsTable(date)
    res.status(200).json({success: true, rows: topDepositsTable})
})


