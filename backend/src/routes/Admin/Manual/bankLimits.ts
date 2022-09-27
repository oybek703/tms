import { Router } from 'express'
import { admin, auth } from '../../../middleware/auth'
import {
	getBankLimits,
	updateDates,
	updateLimit
} from '../../../controllers/Admin/Manual/bankLimits'

const router = Router()

router.route('/').get(auth, admin, getBankLimits)
router.route('/updateDates').post(auth, admin, updateDates)
router.route('/updateLimit').post(auth, admin, updateLimit)

export default router
