import { Router } from 'express'
import { auth } from '../../middleware/auth'
import getPlat from '../../controllers/Treasury/plat'

const router = Router()

router.route('/').get(auth, getPlat)

export default router
