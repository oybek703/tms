const {checkPagePermission} = require('../../middleware/auth')
const {getInterbankDeposits} = require("../../controllers/Treasury/interbankDeposits")
const {auth} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getInterbankDeposits)

module.exports = router