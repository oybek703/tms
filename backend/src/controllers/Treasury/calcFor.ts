import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getCalcForTable from '../../utils/calcFor'
import { getData } from '../../models/db_apis'

// @desc Get Calculate FOR
// @route /api/calc-for
// access Private
export const getCalcFor = asyncMiddleware(async (req: Request, res: Response) => {
  const { date } = req.query
  // @ts-ignore
  const calcForTable = await getCalcForTable(date)
  res.status(200).json({ success: true, rows: calcForTable })
})

// @desc Put Update CB Standard
// @route /api/updatecbn
// access Admin
export const updateCbn = asyncMiddleware(async (req: Request, res: Response) => {
  const { fromDate, toDate, cbNorm } = req.body
  const { rows: [existingData] } = await getData(`SELECT
                                           *
                                    FROM FOR_STANDARD
                                    WHERE
                                          FROM_DATE=TO_DATE('${fromDate}', 'YYYY-MM-DD')
                                      AND
                                          END_DATE=TO_DATE('${toDate}', 'YYYY-MM-DD')`)
  if (existingData) {
    await getData(
        `UPDATE FOR_STANDARD SET CB_STANDARD='${cbNorm}'
             WHERE FROM_DATE=TO_DATE('${fromDate}', 'YYYY-MM-DD')
             AND END_DATE=TO_DATE('${toDate}', 'YYYY-MM-DD')`)
    return res.status(200).json({
      success: true,
      message: 'Existing normative successfully updated.'
    })
  }
  await getData(
      `INSERT INTO 
                 FOR_STANDARD(CB_STANDARD, FROM_DATE, END_DATE) 
                 VALUES (
                         '${cbNorm}', 
                         TO_DATE('${fromDate}', 'YYYY-MM-DD'), 
                         TO_DATE('${toDate}', 'YYYY-MM-DD'))`)
  res.status(201).json({ success: true, message: 'Central bank normative added successfully.' })
})

