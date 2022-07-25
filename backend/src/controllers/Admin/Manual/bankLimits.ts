import { Request, Response } from 'express'
import asyncMiddleware from '../../../utils/async'
import { getData } from '../../../models/db_apis'

// @desc Get limit of banks dates
// @route /banklimits/dates
// access Admin
export const getBankLimits = asyncMiddleware(async (req: Request, res: Response) => {
  const { rows: dates } = await getData(`SELECT UNIQUE TO_CHAR(DATE_BEGIN, 'yyyy-MM-dd') BEGIN,
                                                       TO_CHAR(DATE_END, 'yyyy-MM-dd')   END
                                         FROM LIMIT_OF_BANKS`)
  const { rows: tableData } = await getData(`SELECT CLIENT_CODE,
                                                    NAME,
                                                    UZS,
                                                    CNY,
                                                    JPY,
                                                    KZT,
                                                    RUB,
                                                    CHF,
                                                    GBP,
                                                    USD,
                                                    EUR
                                             FROM LIMIT_OF_BANKS`)
  res.json({ success: true, data: { dates, tableData } })
})

// @desc Update limit of banks dates
// @route /banklimits/updateDates
// access Admin
export const updateDates = asyncMiddleware(async (req: Request, res: Response) => {
  const { beginDate, endDate } = req.body
  await getData(`UPDATE LIMIT_OF_BANKS SET DATE_BEGIN=DATE '${beginDate}' where 1=1`)
  await getData(`UPDATE LIMIT_OF_BANKS SET DATE_END=DATE '${endDate}' where 1=1`)
  res.json({ success: true, message: 'updated' })
})

// @desc Update bank limit value
// @route /banklimits/updateLimit
// access Admin
export const updateLimit = asyncMiddleware(async (req: Request, res: Response) => {
  const { code, currency, newLimit } = req.body
  await getData(`UPDATE LIMIT_OF_BANKS SET ${currency}=${+newLimit}
                     WHERE CLIENT_CODE='${code}'`)
  res.json({ success: true, message: 'updated' })
})

