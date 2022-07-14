const asyncMiddleware = require('../../utils/async')
const ErrorResponse = require('../../utils/errorResponse')
const getCurrencyPositionTable = require("../../utils/currencyPosition")

// @desc Get Currency Position
// @route /api/currencyposition
// access Private
exports.getCurrencyPosition = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const currencyPositionTable = await getCurrencyPositionTable(date)
    res.status(200).json({success: true, rows: currencyPositionTable})
})