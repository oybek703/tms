const {getDepositsByDeadline} = require('../../controllers/Analytics/depositsByDeadline')
const {checkPagePermission} = require('../../middleware/auth')
const {auth} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getDepositsByDeadline)

module.exports = router