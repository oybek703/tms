import { Router } from 'express'
import { auth } from '../../middleware/auth'
import getDashboard from '../../controllers/Analytics/dashboard'

const router = Router()

router.route('/').get(auth, getDashboard)

export default router
