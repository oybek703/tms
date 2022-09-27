import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import CreditPart from '../../utils/dashboard/creditPart'

// @desc Get dashboard credit part data
// @route /api/creditData
// access Private
const getCreditData = asyncMiddleware(async (req: Request, res: Response) => {
	const { date } = req.query
	// @ts-ignore
	const creditData = await new CreditPart(date).getRows()
	res
		.status(200)
		.json({ success: true, rows: { ...creditData, creditPart: creditData.creditPart1 } })
})

export default getCreditData
