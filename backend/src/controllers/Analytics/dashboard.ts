import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getDashboardData from '../../utils/dashboard'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get dashboard
// @route /api/dashboard
// access Private
const getDashboard = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const dashboardData = await getDashboardData(date)
	res.status(200).json({ success: true, rows: dashboardData })
})

export default getDashboard
