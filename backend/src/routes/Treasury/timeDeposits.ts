import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import getTimeDeposits from '../../controllers/Treasury/timeDeposits'

const router = Router()

router.route('/').get(auth, checkPagePermission, getTimeDeposits)

export default router
