import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getProfitAndLostTable from '../../utils/profitAndLost'

// @desc Get profit and lost
// @route /api/profitandlost
// access Private
const getProfitAndLost = asyncMiddleware(async (req: Request, res: Response) => {
	const { date } = req.query
	// @ts-ignore
	const profitAndLost = await getProfitAndLostTable(date)
	res.status(200).json({ success: true, rows: profitAndLost })
})

export default getProfitAndLost
