import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getTimeDepositsTable from '../../utils/timeDeposits'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get Time Deposits
// @route /api/timedeposits
// access Private
const getTimeDeposits = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const timeDepositsTable = await getTimeDepositsTable(date)
	res.status(200).json({ success: true, rows: timeDepositsTable })
})

export default getTimeDeposits
