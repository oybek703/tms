import {Request, Response} from 'express'
import asyncMiddleware from '../utils/async'
import { getData } from '../models/db_apis'


// @desc Get Operational Days
// @route /oper_days
// access Public
export const getOperDays = asyncMiddleware(async (req: Request, res: Response) => {
    const { rows } = await getData(
            `SELECT TO_CHAR(oper_day, 'DD.MM.YYYY') OPER_DAY
             FROM ibs.day_operational@IABS
             WHERE OPER_DAY >= TO_DATE('01.01.2006', 'DD-MM-YYYY')
             ORDER BY oper_day DESC`
    )
    // @ts-ignore
    const dates = rows.map(({ OPER_DAY }) => OPER_DAY)
    res.status(200).json({ success: true, dates })
})

// @desc Get Last Update Time
// @route /last_update
// access Public
export const getLastUpdateTime = asyncMiddleware(async (req: Request, res: Response) => {
    // @ts-ignore
    const { rows: [{ LAST_UPDATE_TIME }] } = await getData(`SELECT TO_CHAR(
                                                                           LOG_DATE,
                                                                           'DD/MM/YYYY, HH24:MM',
                                                                           'NLS_DATE_LANGUAGE = RUSSIAN') LAST_UPDATE_TIME
                                                            FROM (SELECT LOG_DATE
                                                                  FROM USER_SCHEDULER_JOB_LOG
                                                                  WHERE JOB_NAME = 'DASHBOARD_JOB'
                                                                  ORDER BY LOG_DATE DESC)
                                                            WHERE ROWNUM = 1`)
    res.status(200).json({ success: true, last_update: LAST_UPDATE_TIME })
})


