import { Router } from 'express'
import { auth, checkPagePermission } from '../../../middleware/auth'
import {
	getGapManual,
	saveGapChanges,
	updateGapManual
} from '../../../controllers/Admin/Manual/gapManual'

const router = Router()

router.route('/').get(auth, checkPagePermission, getGapManual)
router.route('/update').post(auth, checkPagePermission, updateGapManual)
router.route('/saveChanges').put(auth, checkPagePermission, saveGapChanges)

export default router
