import { Router } from 'express'
import { admin, auth } from './../middleware/auth'
import { getAllBanks } from '../controllers/bankRating'

const router = Router()

router.route('/banks').get(auth, admin, getAllBanks)

export default router
