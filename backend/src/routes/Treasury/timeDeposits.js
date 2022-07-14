const {checkPagePermission} = require('../../middleware/auth')
const {getTimeDeposits} = require('../../controllers/Treasury/timeDeposits')
const {auth} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getTimeDeposits)

module.exports = router