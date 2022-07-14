const {getPlat} = require("../../controllers/Treasury/plat")
const {auth} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, getPlat)

module.exports = router