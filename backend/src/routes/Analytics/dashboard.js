const {getDashboard} = require("../../controllers/Analytics/dashboard")
const {auth} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, getDashboard)

module.exports = router