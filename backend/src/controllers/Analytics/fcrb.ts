import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getFcrbTable from '../../utils/fcrb'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get Formation of the Centralized Resource Base
// @route /api/fcrb
// access Private
const getFcrb = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const fcrbTable = await getFcrbTable(date)
	res.status(200).json({ success: true, rows: fcrbTable })
})

export default getFcrb
