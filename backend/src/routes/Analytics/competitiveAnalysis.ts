import { Router } from 'express'
import { auth } from '../../middleware/auth'
import getCompetitiveAnalysis from '../../controllers/Analytics/competitiveAnalysis'

const router = Router()

router.route('/').get(auth, getCompetitiveAnalysis)

export default router
