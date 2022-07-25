import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import getTimeDepoClients from '../../controllers/Treasury/timeDepoClients'

const router = Router()

router.route('/').get(auth, checkPagePermission, getTimeDepoClients)

export default router
