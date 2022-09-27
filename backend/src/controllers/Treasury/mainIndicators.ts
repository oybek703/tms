import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getMainIndicatorsTable from '../../utils/mainIndicators'

// @desc Get main indicators
// @route /api/mainindicators
// access Private
const getMainIndicators = asyncMiddleware(async (req: Request, res: Response) => {
	const { date } = req.query
	// @ts-ignore
	const mainIndicators = await getMainIndicatorsTable(date)
	res.status(200).json({ success: true, rows: mainIndicators })
})

export default getMainIndicators
