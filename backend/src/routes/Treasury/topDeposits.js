const {getTopDeposits} = require("../../controllers/Treasury/topDeposits")
const {auth, checkPagePermission} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getTopDeposits)

module.exports = router