import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getReportLiabilitiesTable from '../../utils/reportLiabilities'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get Report Liabilities
// @route /api/reportliabilities
// access Private
const getReportLiabilities = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const reportLiabilitiesTable = await getReportLiabilitiesTable(date)
	res.status(200).json({ success: true, rows: reportLiabilitiesTable })
})

export default getReportLiabilities
