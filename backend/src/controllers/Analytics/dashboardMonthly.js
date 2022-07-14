const asyncMiddleware = require('../../utils/async')
const getDashboardMonthlyData = require('../../utils/dashboardMonthly')

// @desc Get Dashboard Monthly
// @route /api/dashboardmonthly
// access Private
exports.getDashboardMonthly = asyncMiddleware(async (req, res) => {
    const {firstDate, secondDate, dateOption} = req.query
    const dashboardMonthlyData = await getDashboardMonthlyData(firstDate, secondDate, dateOption)
    res.status(200).json({success: true, rows: dashboardMonthlyData})
})

