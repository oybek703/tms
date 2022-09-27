import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getPlatTable from '../../utils/placedAndAttracted'

// @desc Get Placed And Attracted
// @route /api/plat
// access Private
const getPlat = asyncMiddleware(async (req: Request, res: Response) => {
	const { date } = req.query
	// @ts-ignore
	const platTable = await getPlatTable(date)
	res.status(200).json({ success: true, rows: platTable })
})

export default getPlat
