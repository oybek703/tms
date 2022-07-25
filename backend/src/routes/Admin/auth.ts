import { Router } from 'express'
import { admin, auth } from '../../middleware/auth'
import { addUser, deleteUserByName,
  getAllUsers, getUserByName, signInUser } from '../../controllers/Admin/auth'

const router = Router()

router.route('/login').post(signInUser)
router.route('/adduser').post(auth, admin, addUser)
router.route('/users').get(auth, admin, getAllUsers)
router.route('/:username').get(auth, admin, getUserByName)
    .delete(auth, admin, deleteUserByName)

export default router
