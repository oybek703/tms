const {checkPagePermission} = require('../../middleware/auth')
const {auth} = require('../../middleware/auth')
const {getCurrencyPosition} = require('../../controllers/Treasury/currencyPosition')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getCurrencyPosition)

module.exports = router