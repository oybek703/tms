const asyncMiddleware = require('../../utils/async')
const getDepositsByDeadlineTable = require('../../utils/depositsByDeadline')

// @desc Get Deposits By Deadline
// @route /api/depositsbydeadline
// access Private
exports.getDepositsByDeadline = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const depositsByDeadlineTable = await getDepositsByDeadlineTable(date)
    res.status(200).json({success: true, rows: depositsByDeadlineTable})
})