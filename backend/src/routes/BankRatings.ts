import { Router } from 'express'
import { admin, auth } from '../middleware/auth'
import { getAddedBanks, searchAddedBanks, searchBankIabs } from '../controllers/BankRatings'

const router = Router()

router.route('/addedBanks').get(auth, admin, getAddedBanks)
router.route('/searchAllBanks').get(auth, admin, searchBankIabs)
router.route('/searchAddedBanks').get(auth, admin, searchAddedBanks)

export default router
