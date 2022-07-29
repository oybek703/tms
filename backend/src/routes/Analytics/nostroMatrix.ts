import { Router } from 'express'
import { auth } from '../../middleware/auth'
import getNostroMatrix from '../../controllers/Analytics/nostroMatrix'

const router = Router()

router.route('/').get(auth, getNostroMatrix)

export default router
