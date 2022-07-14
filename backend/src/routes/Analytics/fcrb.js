const {getFcrb} = require('../../controllers/Analytics/fcrb')
const {auth} = require('../../middleware/auth')
const {Router} = require('express')

const router = Router()

    router.route('/').get(auth, getFcrb)

module.exports = router