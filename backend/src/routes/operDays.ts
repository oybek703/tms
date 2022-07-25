import { getLastUpdateTime, getOperDays } from '../controllers/operDays'
import { Router } from 'express'

const router = Router()

router.route('/').get(getOperDays)
router.route('/lastUpdate').get(getLastUpdateTime)

export default router
