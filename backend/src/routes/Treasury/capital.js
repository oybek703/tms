const {checkPagePermission} = require('../../middleware/auth')
const {auth} = require('../../middleware/auth')
const {getCapital} = require("../../controllers/Treasury/capital")
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getCapital)

module.exports = router