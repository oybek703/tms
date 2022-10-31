// @desc Get GAP
// @route /api/gap
// access Private
import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getGapTable from '../../utils/gap'
import { getData } from '../../models/db_apis'
import { RequestWithDateQuery } from '../controllers.interface'

export const getGap = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const gapTable = await getGapTable()
	res.status(200).json({ success: true, rows: gapTable })
})

// @desc Get GAP Last Update time
// @route /api/gap/lastGapUpdate
// access Private
export const getGapLastUpdate = asyncMiddleware(
	async (req: RequestWithDateQuery, res: Response) => {
		const { rows = [] } = await getData(
			`SELECT TO_CHAR(MAX(LAST_START_DATE), 'fmDD-month, HH24:fmMI:SS', 'NLS_DATE_LANGUAGE = RUSSIAN') 
              AS "lastGapUpdate" FROM   USER_SCHEDULER_JOBS WHERE  JOB_NAME = UPPER('GAP_Analysis')`
		)
		res.status(200).json({ success: true, rows })
	}
)
