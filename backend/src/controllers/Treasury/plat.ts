import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getPlatTable from '../../utils/placedAndAttracted'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get Placed And Attracted
// @route /api/plat
// access Private
const getPlat = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const platTable = await getPlatTable(date)
	res.status(200).json({ success: true, rows: platTable })
})

export default getPlat
