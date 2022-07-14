const asyncMiddleware = require('../../utils/async')
const getProfitAndLostTable = require("../../utils/profitAndLost")

// @desc Get profit and lost
// @route /api/profitandlost
// access Private
exports.getProfitAndLost = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const profitAndLost = await getProfitAndLostTable(date)
    res.status(200).json({success: true, rows: profitAndLost})
})
