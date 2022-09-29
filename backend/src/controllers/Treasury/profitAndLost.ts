import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getProfitAndLostTable from '../../utils/profitAndLost'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get profit and lost
// @route /api/profitandlost
// access Private
const getProfitAndLost = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const profitAndLost = await getProfitAndLostTable(date)
	res.status(200).json({ success: true, rows: profitAndLost })
})

export default getProfitAndLost
