import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import getInterbankDeposits from '../../controllers/Treasury/interbankDeposits'

const router = Router()

router.route('/').get(auth, checkPagePermission, getInterbankDeposits)

export default router
