import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getDashboardData from '../../utils/dashboard'

// @desc Get dashboard
// @route /api/dashboard
// access Private
const getDashboard = asyncMiddleware(async (req: Request, res: Response) => {
	const { date } = req.query
	// @ts-ignore
	const dashboardData = await getDashboardData(date)
	res.status(200).json({ success: true, rows: dashboardData })
})

export default getDashboard
