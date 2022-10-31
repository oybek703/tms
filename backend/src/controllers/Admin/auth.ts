import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import ErrorResponse from '../../utils/errorResponse'
import { getData } from '../../models/db_apis'
import { compare, genSalt, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

interface User {
	id: number
	userName: string
	password: string
	role: string
	allowedPages: string
}

// @desc Sign in user
// @route /auth/login
// access Public
export const signInUser = asyncMiddleware(async (req: Request, res: Response) => {
	const { userName, password } = req.body
	const query = `SELECT ID as "id", USERNAME AS "userName", ROLE AS "role", 
								 ALLOWED_PAGES AS "allowedPages", PASSWORD as "password" 
								 FROM TRS_USERS WHERE USERNAME='${userName}'`
	const { rows = [] } = await getData(query)
	const user: User | undefined = rows[0] as User
	if (user) {
		if (!password) throw new ErrorResponse(400, 'Invalid password.')
		const matchPassword = await compare(password, user.password)
		if (matchPassword) {
			const token = sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '4h' })
			res.status(200).json({
				success: true,
				token,
				userName: user.userName,
				role: user.role,
				pages: user.allowedPages
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
	const { userName, password, confirmPassword, allowedPages } = req.body
	const { rows = [] } = await getData(`SELECT * FROM TRS_USERS WHERE USERNAME='${userName}'`)
	const existingUser: User = rows[0] as User
	if (existingUser) throw new ErrorResponse(400, 'user_exists')
	if (password !== confirmPassword) throw new ErrorResponse(400, 'match_password')
	const salt = await genSalt(10)
	const hashedPassword = await hash(password, salt)
	const ALLOWED_PAGES = allowedPages === 'ALL' ? 'ALL' : allowedPages.join(',')
	await getData(`INSERT INTO TRS_USERS (USERNAME, PASSWORD, ALLOWED_PAGES) 
                       VALUES ('${userName}', '${hashedPassword}', '${ALLOWED_PAGES}')`)
	res.json({ success: true, message: 'User added successfully.' })
})

// @desc Edit user
// @route /auth/editUser
// access Admin
export const editUser = asyncMiddleware(async (req: Request, res: Response) => {
	const { userId } = req.params
	const { newUsername, newPassword, confirmNewPassword, allowedPages } = req.body
	const { rows = [] } = await getData(
		`SELECT PASSWORD AS "password", ALLOWED_PAGES AS "allowedPages" FROM TRS_USERS WHERE ID='${userId}'`
	)
	const user: User = rows[0] as User
	let hashedPassword = user.password
	if (newPassword && confirmNewPassword) {
		if (newPassword !== confirmNewPassword) throw new ErrorResponse(400, 'Password should match.')
		const salt = await genSalt(10)
		hashedPassword = await hash(newPassword, salt)
	}
	const updatedUserName = newUsername && newUsername.length > 0 ? newUsername : user.userName
	const ALLOWED_PAGES =
		allowedPages === 'ALL'
			? 'ALL'
			: allowedPages && allowedPages.length > 0
			? allowedPages.join(',')
			: user.allowedPages
	await getData(`UPDATE TRS_USERS SET USERNAME='${updatedUserName}', 
                     PASSWORD='${hashedPassword}', ALLOWED_PAGES='${ALLOWED_PAGES}' WHERE ID='${userId}'`)
	res.json({ success: true, message: 'User updated successfully.' })
})

// @desc Delete user
// @route /auth/:username
// access Admin
export const deleteUserByName = asyncMiddleware(async (req: Request, res: Response) => {
	const { userName } = req.params
	const { rows = [] } = await getData(`SELECT * FROM TRS_USERS WHERE USERNAME='${userName}'`)
	const user: User = rows[0] as User
	if (!user) throw new ErrorResponse(404, 'User does not exists.')
	await getData(`DELETE FROM TRS_USERS WHERE USERNAME='${userName}'`)
	res.json({ success: true, message: `${userName} deleted successfully.` })
})

// @desc Get all users
// @route /auth/users
// access Admin
export const getAllUsers = asyncMiddleware(async (req: Request, res: Response) => {
	const { rows } = await getData(
		`SELECT ID AS "id", USERNAME AS "userName", ALLOWED_PAGES AS "allowedPages", ROLE AS "role" FROM TRS_USERS`
	)
	res.status(200).json({ success: true, users: rows })
})

// @desc Get user by id
// @route /users/:username
// access Admin
export const getUserByName = asyncMiddleware(async function (req: Request, res: Response) {
	const { userId } = req.params
	const query = `SELECT ID AS "id", USERNAME AS "userName", ALLOWED_PAGES AS "allowedPages", ROLE AS "role" FROM TRS_USERS WHERE ID='${userId}'`
	const { rows = [] } = await getData(query)
	const user: User = rows[0] as User
	if (!user) throw new ErrorResponse(404, `User with id of ${userId} not found.`)
	res.status(200).json({ success: true, user })
})
