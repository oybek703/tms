const asyncMiddleware = require('../../utils/async')
const getGapTable = require('../../utils/gap')

// @desc Get GAP
// @route /api/gap
// access Private
exports.getGap = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const gapTable = await getGapTable(date)
    res.status(200).json({success: true, rows: gapTable})
})

