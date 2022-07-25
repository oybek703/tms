import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import getMainIndicators from '../../controllers/Treasury/mainIndicators'

const router = Router()

router.route('/').get(auth, checkPagePermission, getMainIndicators)

export default router
