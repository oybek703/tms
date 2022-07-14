const asyncMiddleware = require('../../utils/async')
const getCapitalTable = require("../../utils/capital")

// @desc Get capital
// @route /api/capital
// access Private
exports.getCapital = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const capitalTable = await getCapitalTable(date)
    res.status(200).json({success: true, rows: capitalTable})
})

