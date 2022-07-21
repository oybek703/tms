import { getLastUpdateTime, getOperDays } from '../controllers/operDays'
import { Router } from 'express'

const router = Router()

router.route('/').get(getOperDays)
router.route('/last_update').get(getLastUpdateTime)

export default router