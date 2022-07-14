const {getLastUpdateTime} = require('../controllers/operDays')
const {getOperDays} = require("../controllers/operDays")
const {Router} = require('express')

const router = Router()

router.route('/').get(getOperDays)
router.route('/last_update').get(getLastUpdateTime)

module.exports = router