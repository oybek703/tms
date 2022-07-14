const express = require('express')
const {checkPagePermission, auth} = require('../../../middleware/auth')
const {
    getGapManual,
    updateGapManual,
    saveGapChanges
} = require('../../../controllers/Admin/Manual/gapManual')

const router = new express.Router()

router.route('/').get(auth, checkPagePermission, getGapManual)
router.route('/update').post(auth, checkPagePermission, updateGapManual)
router.route('/saveChanges').put(auth, checkPagePermission, saveGapChanges)

module.exports = router