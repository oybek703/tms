import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getTimeDepoClientsTable from '../../utils/timeDepoClients'

// @desc Get Time Depo Clients
// @route /api/tdc
// access Private
const getTimeDepoClients = asyncMiddleware(async (req: Request, res: Response) => {
	const { date } = req.query
	// @ts-ignore
	const timeDepoClientsTable = await getTimeDepoClientsTable(date)
	res.status(200).json({ success: true, rows: timeDepoClientsTable })
})

export default getTimeDepoClients
