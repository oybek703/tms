const asyncMiddleware = require('../../utils/async')
const getCorrespondentTable = require("../../utils/correspondent")

// @desc Get correspondent
// @route /api/correspondent
// access Private
exports.getCorrespondent = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const correspondentTable = await getCorrespondentTable(date)
    res.status(200).json({success: true, rows: correspondentTable})
})

// @desc Get correspondent current state
// @route /api/correspondent/current_state
// access Private
exports.getCorrespondentCurrentState = asyncMiddleware(async (req, res) => {
    const currentStateTable = await getCorrespondentTable(new Date(), true)
    res.status(200).json({success: true, rows: currentStateTable})
})