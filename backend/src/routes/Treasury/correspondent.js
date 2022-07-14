const {checkPagePermission} = require('../../middleware/auth')
const {auth} = require('../../middleware/auth')
const {getCorrespondent, getCorrespondentCurrentState} = require("../../controllers/Treasury/correspondent")
const {Router} = require('express')

const router = Router()

router.route('/').get(auth, checkPagePermission, getCorrespondent)
router.route('/current_state').get(auth, checkPagePermission, getCorrespondentCurrentState)

module.exports = router