import { Router } from 'express'
import { auth } from '../../middleware/auth'
import getVlaBuffer from '../../controllers/Analytics/vlaBuffer'

const router = Router()

router.route('/').get(auth, getVlaBuffer)

export default router
