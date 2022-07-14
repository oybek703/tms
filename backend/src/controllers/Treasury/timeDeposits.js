const asyncMiddleware = require('../../utils/async')
const getTimeDepositsTable = require('../../utils/timeDeposits')

// @desc Get Time Deposits
// @route /api/timedeposits
// access Private
exports.getTimeDeposits = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const timeDepositsTable = await getTimeDepositsTable(date)
    res.status(200).json({success: true, rows: timeDepositsTable})
})


