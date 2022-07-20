import { Router } from 'express'
import { admin, auth } from '../../middleware/auth'
import { getCalcFor, updateCbn } from '../../controllers/Treasury/calcFor'

const router = Router()

router.route('/updatecbn').put(auth, admin, updateCbn)
router.route('/').get(auth, getCalcFor)

export default router