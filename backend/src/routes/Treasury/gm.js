const {checkPagePermission} = require('../../middleware/auth')
const {getGM, setMIO} = require("../../controllers/Treasury/gm")
const {auth} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/setmio').put(auth, checkPagePermission, setMIO)
router.route('/').get(auth, checkPagePermission, getGM)

module.exports = router