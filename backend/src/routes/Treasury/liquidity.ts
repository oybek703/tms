import { Router } from 'express'
import { auth, checkPagePermission } from '../../middleware/auth'
import { getLiquidity, getLiquidityCurrentState } from '../../controllers/Treasury/liquidity'

const router = Router()

router.route('/').get(auth, checkPagePermission, getLiquidity)
router.route('/current_state').get(auth, checkPagePermission, getLiquidityCurrentState)

export default router
