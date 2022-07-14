const express = require('express')
const {admin, auth} = require('../../../middleware/auth')
const {
    getBankLimits,
    updateDates,
    updateLimit
} = require('../../../controllers/Admin/Manual/bankLimits')

const router = new express.Router()

router.route('/').get(auth, admin, getBankLimits)
router.route('/updateDates').post(auth, admin, updateDates)
router.route('/updateLimit').post(auth, admin, updateLimit)

module.exports = router