import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import getDepositsByDeadline from '../../controllers/Analytics/depositsByDeadline'

const router = Router()

router.route('/').get(auth, checkPagePermission, getDepositsByDeadline)

export default router