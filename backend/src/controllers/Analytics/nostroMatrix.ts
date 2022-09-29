import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getNostroMatrixTable from '../../utils/nostroMatrix'

// @desc Get Nostro Accounts Matrix
// @route /api/nostroMatrix
// access Private
const getNostroMatrix = asyncMiddleware(
	async (
		req: Request<
			{},
			{},
			{},
			{
				firstDate: string
				secondDate: string
			}
		>,
		res: Response
	) => {
		const { firstDate, secondDate } = req.query
		const nostroMatrixTable = await getNostroMatrixTable(firstDate, secondDate)
		res.status(200).json({ success: true, rows: nostroMatrixTable })
	}
)

export default getNostroMatrix
