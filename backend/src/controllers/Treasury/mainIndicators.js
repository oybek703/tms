const asyncMiddleware = require('../../utils/async')
const getMainIndicatorsTable = require("../../utils/mainIndicators")

// @desc Get main indicators
// @route /api/mainindicators
// access Private
exports.getMainIndicators = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const mainIndicators = await getMainIndicatorsTable(date)
    res.status(200).json({success: true, rows: mainIndicators})
})
