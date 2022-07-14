const {checkPagePermission} = require('../../middleware/auth')
const {auth} = require('../../middleware/auth')
const {getLiquidity, getLiquidityCurrentState} = require("../../controllers/Treasury/liquidity")
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getLiquidity)
router.route('/current_state').get(auth, checkPagePermission, getLiquidityCurrentState)

module.exports = router