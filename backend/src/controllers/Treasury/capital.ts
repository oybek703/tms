import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getCapitalTable from '../../utils/capital'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get capital
// @route /api/capital
// access Private
const getCapital = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const capitalTable = await getCapitalTable(date)
	res.status(200).json({ success: true, rows: capitalTable })
})

export default getCapital
