import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getTopDepositsTable from '../../utils/topDeposits'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get Top Deposits
// @route /api/topdeposits
// access Private
const getTopDeposits = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const topDepositsTable = await getTopDepositsTable(date)
	res.status(200).json({ success: true, rows: topDepositsTable })
})

export default getTopDeposits
