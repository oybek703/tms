import { Request, Response } from 'express'
import asyncMiddleware from '../utils/async'
import { getData } from '../models/db_apis'

interface RowsFirstElement {
	OPER_DAY?: string
	LAST_UPDATE_TIME?: string
}

// @desc Get Operational Days
// @route /oper_days
// access Public
export const getOperDays = asyncMiddleware(async (req: Request, res: Response) => {
	const query = `SELECT TO_CHAR(OPER_DAY, 'DD.MM.YYYY') OPER_DAY FROM IBS.DAY_OPERATIONAL@IABS
                   WHERE OPER_DAY >= TO_DATE('01.01.2006', 'DD-MM-YYYY') ORDER BY OPER_DAY DESC`
	const { rows = [] } = await getData(query)
	const dates = (rows as [RowsFirstElement]).map(({ OPER_DAY }) => OPER_DAY)
	res.status(200).json({ success: true, dates })
})

// @desc Get Last Update Time
// @route /last_update
// access Public
export const getLastUpdateTime = asyncMiddleware(async (req: Request, res: Response) => {
	const query = `
      SELECT TO_CHAR(LOG_DATE, 'fmDD-month, HH24:fmMI:SS', 'NLS_DATE_LANGUAGE = RUSSIAN') LAST_UPDATE_TIME
      FROM (SELECT LOG_DATE FROM USER_SCHEDULER_JOB_LOG WHERE JOB_NAME = 'DASHBOARD_JOB'
            ORDER BY LOG_DATE DESC)
      WHERE ROWNUM = 1
  `
	const { rows = [] } = await getData(query)
	const { LAST_UPDATE_TIME: lastUpdate } = (rows[0] as RowsFirstElement) || {}
	res.status(200).json({ success: true, lastUpdate })
})
