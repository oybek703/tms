const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../', '../config')})
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')
const {getData} = require('../models/db_apis')
const parse = require('url-parse')

async function auth(req, res, next) {
    try {
        const [_, token] = req.headers.authorization.split(' ')
        if (!token) return next(new ErrorResponse(401, 'Not authorized.'))
        const {id} = await jwt.verify(token, process.env.JWT_SECRET)
        const {rows: [user]} = await getData(`SELECT * FROM TRS_USERS WHERE ID='${id}'`)
        if (!user) return next(new ErrorResponse(404, 'User not found.'))
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        const {name} = e
        if (name === 'TokenExpiredError') return next(new ErrorResponse(440, 'Session expired.'))
        next(new ErrorResponse(500, 'Something went wrong on server side.'))
    }
}

async function checkPagePermission(req, res, next) {
    try {
        const {ALLOWED_PAGES} = req.user
        const {pathname} = parse(req.originalUrl)
        const path = `/${pathname.split('/')[2]}`
        if (ALLOWED_PAGES === 'ALL') return next()
        if (!ALLOWED_PAGES) return next(
            new ErrorResponse(
                403,
                'access_denied'
            )
        )
        const allowedPagesArray = ALLOWED_PAGES.split(',')
        if (!allowedPagesArray.includes(path)) {
            return next(
                new ErrorResponse(
                    403,
                    'access_denied'
                )
            )
        }
        next()
    } catch (e) {
        next(new ErrorResponse(500, 'Something went wrong on the server side.'))
    }
}

async function admin(req, res, next) {
    try {
        const {ROLE} = req.user
        if (ROLE !== 'admin') return next(
            new ErrorResponse(
                403,
                'access_denied'
            )
        )
        next()
    } catch (e) {
        next(new ErrorResponse(403, 'No access.'))
    }
}

module.exports = {
    auth,
    admin,
    checkPagePermission
}