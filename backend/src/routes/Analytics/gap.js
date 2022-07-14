const {getGap} = require('../../controllers/Analytics/gap')
const {checkPagePermission} = require('../../middleware/auth')
const {auth} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getGap)

module.exports = router