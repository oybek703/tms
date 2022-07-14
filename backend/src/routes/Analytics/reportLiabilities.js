const {getReportLiabilities} = require('../../controllers/Analytics/reportLiabilities')
const {checkPagePermission} = require('../../middleware/auth')
const {auth} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getReportLiabilities)

module.exports = router