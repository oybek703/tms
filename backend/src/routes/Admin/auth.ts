import { Router } from 'express'
import { admin, auth } from '../../middleware/auth'
import {
  addUser, deleteUserByName, editUser,
  getAllUsers, getUserByName, signInUser
} from '../../controllers/Admin/auth'

const router = Router()

router.route('/login').post(signInUser)
router.route('/adduser').post(auth, admin, addUser)
router.route('/users').get(auth, admin, getAllUsers)
router.route('/users/:username').delete(auth, admin, deleteUserByName)
router.route('/users/:userId').get(auth, admin, getUserByName)
    .put(auth, admin, editUser)


export default router
