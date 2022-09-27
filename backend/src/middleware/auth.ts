import { Request, Response, NextFunction } from 'express'
import ErrorResponse from '../utils/errorResponse'
import { verify } from 'jsonwebtoken'
import { getData } from '../models/db_apis'
const parse = require('url-parse')

export async function auth(req: Request, res: Response, next: NextFunction) {
	try {
		if (!req.headers.authorization) return next(new ErrorResponse(401, 'Not authorized.'))
		const [_, token] = req.headers.authorization?.split(' ')
		if (!token) return next(new ErrorResponse(401, 'Not authorized.'))
		// @ts-ignore
		const { id } = await verify(token, process.env.JWT_SECRET)
		const { rows } = await getData(`SELECT * FROM TRS_USERS WHERE ID='${id}'`)
		// @ts-ignore
		const user = rows[0] as req.user
		if (!user) return next(new ErrorResponse(404, 'User not found.'))
		req.user = user
		next()
	} catch (e) {
		console.log(e)
		// @ts-ignore
		const { name, message } = e
		if (name === 'TokenExpiredError') return next(new ErrorResponse(440, 'Session expired.'))
		if (name === 'JsonWebTokenError') return next(new ErrorResponse(440, message))
		next(new ErrorResponse(500, 'Something went wrong on server side.'))
	}
}

export async function checkPagePermission(req: Request, res: Response, next: NextFunction) {
	try {
		// @ts-ignore
		const { ALLOWED_PAGES } = req.user
		if (ALLOWED_PAGES === 'ALL') return next()
		const { pathname } = parse(req.originalUrl)
		const path = `/${pathname.split('/')[2]}`
		if (!ALLOWED_PAGES) return next(new ErrorResponse(403, 'access_denied'))
		const allowedPagesArray = ALLOWED_PAGES.split(',')
		if (!allowedPagesArray.includes(path)) return next(new ErrorResponse(403, 'access_denied'))
		next()
	} catch (e) {
		next(new ErrorResponse(500, 'Something went wrong on the server side.'))
	}
}

export async function admin(req: Request, res: Response, next: NextFunction) {
	try {
		// @ts-ignore
		const { ROLE } = req.user
		if (ROLE !== 'admin') return next(new ErrorResponse(403, 'access_denied'))
		next()
	} catch (e) {
		next(new ErrorResponse(403, 'No access.'))
	}
}
