import { Router } from 'express'
import { auth } from '../../middleware/auth'
import getFcrb from '../../controllers/Analytics/fcrb'

const router = Router()

router.route('/').get(auth, getFcrb)

export default router