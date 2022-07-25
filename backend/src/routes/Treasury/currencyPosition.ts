import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import getCurrencyPosition from '../../controllers/Treasury/currencyPosition'

const router = Router()

router.route('/').get(auth, checkPagePermission, getCurrencyPosition)

export default router
