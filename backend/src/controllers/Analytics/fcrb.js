const asyncMiddleware = require('../../utils/async')
const getFcrbTable = require('../../utils/fcrb')

// @desc Get Formation of the Centralized Resource Base
// @route /api/fcrb
// access Private
exports.getFcrb = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const fcrbTable = await getFcrbTable(date)
    res.status(200).json({success: true, rows: fcrbTable})
})

