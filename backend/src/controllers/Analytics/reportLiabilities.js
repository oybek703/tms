const asyncMiddleware = require('../../utils/async')
const getReportLiabilitiesTable = require('../../utils/reportLiabilities')

// @desc Get Report Liabilities
// @route /api/reportliabilities
// access Private
exports.getReportLiabilities = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const reportLiabilitiesTable = await getReportLiabilitiesTable(date)
    res.status(200).json({success: true, rows: reportLiabilitiesTable})
})

