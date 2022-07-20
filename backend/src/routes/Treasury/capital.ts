import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import getCapital from '../../controllers/Treasury/capital'

const router = Router()

router.route('/').get(auth, checkPagePermission, getCapital)

export default router