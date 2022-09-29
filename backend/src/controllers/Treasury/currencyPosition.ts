import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getCurrencyPositionTable from '../../utils/currencyPosition'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get Currency Position
// @route /api/currencyposition
// access Private
const getCurrencyPosition = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const currencyPositionTable = await getCurrencyPositionTable(date)
	res.status(200).json({ success: true, rows: currencyPositionTable })
})

export default getCurrencyPosition
