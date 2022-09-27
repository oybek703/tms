import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getTimeDepositsTable from '../../utils/timeDeposits'

// @desc Get Time Deposits
// @route /api/timedeposits
// access Private
const getTimeDeposits = asyncMiddleware(async (req: Request, res: Response) => {
	const { date } = req.query
	// @ts-ignore
	const timeDepositsTable = await getTimeDepositsTable(date)
	res.status(200).json({ success: true, rows: timeDepositsTable })
})

export default getTimeDeposits
