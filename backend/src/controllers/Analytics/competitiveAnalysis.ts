import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import { RequestWithDateQuery } from '../controllers.interface'
import getCompetitiveAnalysisTable from '../../utils/competitiveAnalysis'

// @desc Get Competitive Analysis
// @route /api/competitiveAnalysis
// access Private
const getCompetitiveAnalysis = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const fcrbTable = await getCompetitiveAnalysisTable(date)
	res.status(200).json({ success: true, rows: fcrbTable })
})

export default getCompetitiveAnalysis
