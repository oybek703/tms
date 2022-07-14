const {getDashboardMonthly} = require('../../controllers/Analytics/dashboardMonthly')
const {auth} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, getDashboardMonthly)

module.exports = router