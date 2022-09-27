import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getReportLiabilitiesTable from '../../utils/reportLiabilities'

// @desc Get Report Liabilities
// @route /api/reportliabilities
// access Private
const getReportLiabilities = asyncMiddleware(async (req: Request, res: Response) => {
	const { date } = req.query
	// @ts-ignore
	const reportLiabilitiesTable = await getReportLiabilitiesTable(date)
	res.status(200).json({ success: true, rows: reportLiabilitiesTable })
})

export default getReportLiabilities
