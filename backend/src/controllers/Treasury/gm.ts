import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getGMTable from '../../utils/gm'
import { getData } from '../../models/db_apis'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get GM
// @route /api/gm
// access Private
export const getGM = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const gmTable = await getGMTable(date)
	res.status(200).json({ success: true, rows: gmTable })
})

// @desc Set Mio
// @route /api/setmio
// access Admin
export const setMIO = asyncMiddleware(async (req: Request, res: Response) => {
	const { mio, mioDate } = req.body
	const {
		// @ts-ignore
		rows: [existingData]
	} = await getData(`
    SELECT *
    FROM (SELECT * FROM GM ORDER BY OPER_DAY DESC)
    WHERE ROLE = 'MIO'
      AND OPER_DAY = TO_DATE('${mioDate}', 'YYYY-MM-DD')
      AND ROWNUM = 1
  `)
	const {
		rows: [sameExistingData]
	} = await getData(`
    SELECT *
    FROM (SELECT * FROM GM ORDER BY OPER_DAY DESC)
    WHERE ROLE = 'MIO'
      AND OPER_DAY < TO_DATE('${mioDate}', 'YYYY-MM-DD')
      AND SALDO_OUT = ${+mio}
      AND ROWNUM = 1
  `)
	if (existingData) {
		await getData(`
        UPDATE GM
        SET SALDO_OUT=${+mio}
        WHERE OPER_DAY = TO_DATE('${mioDate}', 'YYYY-MM-DD')
          AND ROLE = 'MIO'
    `)
		return res.status(200).json({ success: true, message: 'Existing data updated successfully.' })
	}
	if (sameExistingData) {
		return res.status(200).json({ success: true, message: 'MIO value is not changed.' })
	}
	await getData(`
    INSERT INTO 
    GM(OPER_DAY, CODE_COA, INDICATOR_NAME, SALDO_OUT, CURRENCY_TYPE, ROLE)
    VALUES (TO_DATE('${mioDate}', 'YYYY-MM-DD'), 'mio_cc', 'Непокрытый текущий аккредитив (МИО)', 
            ${mio}, 'mio_c', 'MIO')
  `)
	res.status(200).json({ success: true, message: `MIO value added successfully.` })
})
