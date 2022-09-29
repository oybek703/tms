import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getMainIndicatorsTable from '../../utils/mainIndicators'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get main indicators
// @route /api/mainindicators
// access Private
const getMainIndicators = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const mainIndicators = await getMainIndicatorsTable(date)
	res.status(200).json({ success: true, rows: mainIndicators })
})

export default getMainIndicators
