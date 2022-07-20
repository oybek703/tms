import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import getProfitAndLost from '../../controllers/Treasury/profitAndLost'

const router = Router()

router.route('/').get(auth, checkPagePermission, getProfitAndLost)

export default router