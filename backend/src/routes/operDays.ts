import { getLastUpdateTime, getOperDays } from '../controllers/operDays'

const {Router} = require('express')

const router = Router()

router.route('/').get(getOperDays)
router.route('/last_update').get(getLastUpdateTime)

export default router