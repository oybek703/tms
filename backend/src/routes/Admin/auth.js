const express = require('express')
const {auth, admin} = require("../../middleware/auth")
const {
    getAllUsers,
    getUserByName,
    signInUser,
    addUser,
    deleteUserByName
} = require('../../controllers/Admin/auth')

const router = new express.Router()

router.route('/login').post(signInUser)
router.route('/adduser').post(auth, admin, addUser)
router.route('/users').get(auth, admin, getAllUsers)
router.route('/:username')
    .get(auth, admin, getUserByName)
    .delete(auth, admin, deleteUserByName)

module.exports = router