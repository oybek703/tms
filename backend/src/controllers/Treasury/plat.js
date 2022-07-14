const asyncMiddleware = require('../../utils/async')
const getPlatTable = require("../../utils/placedAndAttracted")

// @desc Get Placed And Attracted
// @route /api/plat
// access Private
exports.getPlat = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const platTable = await getPlatTable(date)
    res.status(200).json({success: true, rows: platTable})
})


