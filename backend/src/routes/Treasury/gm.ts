import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import { getGM, setMIO } from '../../controllers/Treasury/gm'

const router = Router()

router.route('/setmio').put(auth, checkPagePermission, setMIO)
router.route('/').get(auth, checkPagePermission, getGM)

export default router
