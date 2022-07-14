const {checkPagePermission} = require('../../middleware/auth')
const {auth} = require('../../middleware/auth')
const {getProfitAndLost} = require("../../controllers/Treasury/profitAndLost")
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getProfitAndLost)

module.exports = router