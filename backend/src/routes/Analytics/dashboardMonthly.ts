import { Router } from 'express'
import { auth } from '../../middleware/auth'
import getDashboardMonthly from '../../controllers/Analytics/dashboardMonthly'

const router = Router()

router.route('/').get(auth, getDashboardMonthly)

export default router
