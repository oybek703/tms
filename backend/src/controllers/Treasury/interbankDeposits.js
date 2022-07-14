const asyncMiddleware = require('../../utils/async')
const getInterbankDepositsTable = require("../../utils/interbankDeposits")

// @desc Get Interbank Deposits
// @route /api/interbankdeposits
// access Private
exports.getInterbankDeposits = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const interbankDepositsTable = await getInterbankDepositsTable(date)
    res.status(200).json({success: true, rows: interbankDepositsTable})
})


