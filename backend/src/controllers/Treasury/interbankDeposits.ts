import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getInterbankDepositsTable from '../../utils/interbankDeposits'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get Interbank Deposits
// @route /api/interbankdeposits
// access Private
const getInterbankDeposits = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const interbankDepositsTable = await getInterbankDepositsTable(date)
	res.status(200).json({ success: true, rows: interbankDepositsTable })
})

export default getInterbankDeposits
