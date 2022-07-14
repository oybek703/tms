const {auth, checkPagePermission} = require('../../middleware/auth')
const {getMainIndicators} = require('../../controllers/Treasury/mainIndicators')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getMainIndicators)

module.exports = router