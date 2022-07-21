import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import getGap from '../../controllers/Analytics/gap'

const router = Router()

router.route('/').get(auth, checkPagePermission, getGap)

export default router