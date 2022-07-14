const {getCalcFor, updateCbn} = require("../../controllers/Treasury/calcFor")
const {auth, admin} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

router.route('/updatecbn').put(auth, admin, updateCbn)
router.route('/').get(auth, getCalcFor)

module.exports = router