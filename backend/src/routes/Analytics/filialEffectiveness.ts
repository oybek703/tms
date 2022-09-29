import { Router } from 'express'
import { auth } from '../../middleware/auth'
import getFilialEffectiveness from '../../controllers/Analytics/filialEffectiveness'

const router = Router()

router.route('/').get(auth, getFilialEffectiveness)

export default router
