import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getTimeDepoClientsTable from '../../utils/timeDepoClients'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get Time Depo Clients
// @route /api/tdc
// access Private
const getTimeDepoClients = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const timeDepoClientsTable = await getTimeDepoClientsTable(date)
	res.status(200).json({ success: true, rows: timeDepoClientsTable })
})

export default getTimeDepoClients
