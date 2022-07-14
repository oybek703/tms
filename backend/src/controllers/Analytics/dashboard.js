const asyncMiddleware = require('../../utils/async')
const getDashboardData = require("../../utils/dashboard")

// @desc Get dashboard
// @route /api/dashboard
// access Private
exports.getDashboard = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const dashboardData = await getDashboardData(date)
    res.status(200).json({success: true, rows: dashboardData})
})

