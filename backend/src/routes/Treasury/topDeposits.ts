import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import getTopDeposits from '../../controllers/Treasury/topDeposits'

const router = Router()

router.route('/').get(auth, checkPagePermission, getTopDeposits)

export default router