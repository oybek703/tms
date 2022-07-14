const {checkPagePermission} = require('../../middleware/auth')
const {getTimeDepoClients} = require("../../controllers/Treasury/timeDepoClients")
const {auth} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getTimeDepoClients)

module.exports = router