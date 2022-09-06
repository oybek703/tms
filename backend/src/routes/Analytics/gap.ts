import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import { getGap, getGapLastUpdate } from '../../controllers/Analytics/gap'

const router = Router()

router.route('/').get(auth, checkPagePermission, getGap)
router.route('/lastGapUpdate').get(auth, checkPagePermission, getGapLastUpdate)

export default router
