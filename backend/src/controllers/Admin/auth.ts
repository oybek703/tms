import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import ErrorResponse from '../../utils/errorResponse'
import { getData } from '../../models/db_apis'
import { compare, genSalt, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

interface User {
	ID: number
	USERNAME: string
	PASSWORD: string
	ROLE: string
	ALLOWED_PAGES: string
}

// @desc Sign in user
// @route /auth/login
// access Public
export const signInUser = asyncMiddleware(async (req: Request, res: Response) => {
	const { username, password } = req.body
	const query = `SELECT * FROM TRS_USERS WHERE USERNAME='${username}'`
	const { rows = [] } = await getData(query)
	const user: User | undefined = rows[0] as User
	if (user) {
		if (!password) throw new ErrorResponse(400, 'Invalid password.')
		const matchPassword = await compare(password, user.PASSWORD)
		if (matchPassword) {
			const token = sign({ id: user.ID }, process.env.JWT_SECRET as string, { expiresIn: '4h' })
			res.status(200).json({
				success: true,
				token,
				username: user.USERNAME,
				ROLE: user.ROLE,
				pages: user.ALLOWED_PAGES
			})
		} else {
			throw new ErrorResponse(400, 'Invalid password.')
		}
	} else {
		throw new ErrorResponse(400, 'Invalid username.')
	}
})

// @desc Add user
// @route /auth/adduser
// access Admin
export const addUser = asyncMiddleware(async (req: Request, res: Response) => {
	const { username, password, confirmpassword, allowedPages } = req.body
	const { rows = [] } = await getData(`SELECT * FROM TRS_USERS WHERE USERNAME='${username}'`)
	const existingUser: User = rows[0] as User
	if (existingUser) throw new ErrorResponse(400, 'user_exists')
	if (password !== confirmpassword) throw new ErrorResponse(400, 'match_password')
	const salt = await genSalt(10)
	const hashedPassword = await hash(password, salt)
	const ALLOWED_PAGES = allowedPages === 'ALL' ? 'ALL' : allowedPages.join(',')
	await getData(`INSERT INTO TRS_USERS (USERNAME, PASSWORD, ALLOWED_PAGES) 
                       VALUES ('${username}', '${hashedPassword}', '${ALLOWED_PAGES}')`)
	res.json({ success: true, message: 'User added successfully.' })
})

// @desc Edit user
// @route /auth/editUser
// access Admin
export const editUser = asyncMiddleware(async (req: Request, res: Response) => {
	const { userId } = req.params
	const { newUsername, newPassword, confirmNewPassword, allowedPages } = req.body
	const { rows = [] } = await getData(`SELECT * FROM TRS_USERS WHERE ID='${userId}'`)
	const user: User = rows[0] as User
	let hashedPassword = user.PASSWORD
	if (newPassword && confirmNewPassword) {
		if (newPassword !== confirmNewPassword) throw new ErrorResponse(400, 'Password should match.')
		const salt = await genSalt(10)
		hashedPassword = await hash(newPassword, salt)
	}
	const updatedPassword = newUsername && newUsername.length > 0 ? newUsername : user.USERNAME
	const ALLOWED_PAGES =
		allowedPages === 'ALL'
			? 'ALL'
			: allowedPages && allowedPages.length > 0
			? allowedPages.join(',')
			: user.ALLOWED_PAGES
	await getData(`UPDATE TRS_USERS SET USERNAME='${updatedPassword}', 
                     PASSWORD='${hashedPassword}', ALLOWED_PAGES='${ALLOWED_PAGES}' WHERE ID='${userId}'`)
	res.json({ success: true, message: 'User updated successfully.' })
})

// @desc Delete user
// @route /auth/:username
// access Admin
export const deleteUserByName = asyncMiddleware(async (req: Request, res: Response) => {
	const { username } = req.params
	const { rows = [] } = await getData(
		`SELECT USERNAME, ID, ALLOWED_PAGES, ROLE FROM TRS_USERS WHERE USERNAME='${username}'`
	)
	const user: User = rows[0] as User
	if (!user) throw new ErrorResponse(404, 'User does not exists.')
	await getData(`DELETE FROM TRS_USERS WHERE USERNAME='${username}'`)
	res.json({ success: true, message: `${username} deleted successfully.` })
})

// @desc Get all users
// @route /auth/users
// access Admin
export const getAllUsers = asyncMiddleware(async (req: Request, res: Response) => {
	const { rows } = await getData(`SELECT ID, USERNAME, ROLE, ALLOWED_PAGES FROM TRS_USERS`)
	res.status(200).json({ success: true, users: rows })
})

// @desc Get user by id
// @route /users/:username
// access Admin
export const getUserByName = asyncMiddleware(async function (req: Request, res: Response) {
	const { userId } = req.params
	const query = `SELECT * FROM TRS_USERS WHERE ID='${userId}'`
	const { rows = [] } = await getData(query)
	const user: User = rows[0] as User
	if (!user) throw new ErrorResponse(404, `User with id of ${userId} not found.`)
	res.status(200).json({ success: true, user })
})
