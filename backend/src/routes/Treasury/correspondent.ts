import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import { getCorrespondent,
  getCorrespondentCurrentState } from '../../controllers/Treasury/correspondent'

const router = Router()

router.route('/').get(auth, checkPagePermission, getCorrespondent)
router.route('/current_state').get(auth, checkPagePermission, getCorrespondentCurrentState)

export default router
