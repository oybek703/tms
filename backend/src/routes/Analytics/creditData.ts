import { Router } from 'express'
import { auth } from '../../middleware/auth'
import getCreditData from '../../controllers/Analytics/creditData'

const router = Router()

router.route('/').get(auth, getCreditData)

export default router
