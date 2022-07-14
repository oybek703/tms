const asyncMiddleware = require('../../utils/async')
const getTimeDepoClientsTable = require("../../utils/timeDepoClients")

// @desc Get Time Depo Clients
// @route /api/tdc
// access Private
exports.getTimeDepoClients = asyncMiddleware(async (req, res) => {
    const {date} = req.query
    const timeDepoClientsTable = await getTimeDepoClientsTable(date)
    res.status(200).json({success: true, rows: timeDepoClientsTable})
})


