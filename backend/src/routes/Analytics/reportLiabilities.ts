import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import getReportLiabilities from '../../controllers/Analytics/reportLiabilities'

const router = Router()

router.route('/').get(auth, checkPagePermission, getReportLiabilities)

export default router