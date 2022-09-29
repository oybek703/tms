import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getDepositsByDeadlineTable from '../../utils/depositsByDeadline'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get Deposits By Deadline
// @route /api/depositsbydeadline
// access Private
const getDepositsByDeadline = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const depositsByDeadlineTable = await getDepositsByDeadlineTable(date)
	res.status(200).json({ success: true, rows: depositsByDeadlineTable })
})

export default getDepositsByDeadline
