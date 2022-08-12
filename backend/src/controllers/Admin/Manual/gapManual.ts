import { Request, Response } from 'express'
import asyncMiddleware from '../../../utils/async'
import { getData } from '../../../models/db_apis'
import GapSimulation from './GapSimulation'

// @desc Get gap manual data
// @route /gapmanual
// access Admin
export const getGapManual = asyncMiddleware(async (req: Request, res: Response) => {
  const { forEditing } = req.query
  const booleanForEditing = forEditing === 'true'
  const query = `BEGIN
                       DELETE FROM GAP_SIMULATION_AUTO WHERE 1=1;
                       DELETE FROM GAP_SIMULATION_MANUAL WHERE 1=1;
                       INSERT INTO GAP_SIMULATION_AUTO (SELECT * FROM GAP_ANALYSIS_AUTO);
                       INSERT INTO GAP_SIMULATION_MANUAL (SELECT * FROM GAP_ANALYSIS_MANUAL);
                   END;`
  if (!booleanForEditing) await getData(query)
  const gapManualData = await (new GapSimulation(booleanForEditing).getRows())
  res.json({ success: true, data: gapManualData })
})

// @desc Get gap manual update
// @route /gapmanual/update
// access Admin
export const updateGapManual = asyncMiddleware(async (req: Request, res: Response) => {
  const { colName, newValue, role, date, source } = req.body
  let updateQuery = `UPDATE GAP_SIMULATION_MANUAL SET ${colName}=${+newValue} 
                       WHERE ROLE='${role}' AND OPER_DAY=${date}`
  if (source === 'AUTO') {
    updateQuery = `UPDATE GAP_SIMULATION_AUTO
                    SET ${colName}=${+newValue}
                    WHERE ROLE = '${role}'
                      AND OPER_DAY = (WITH CTE AS (SELECT OPER_DAY,
                                                          ROW_NUMBER() OVER (ORDER BY OPER_DAY) AS ROW_NUMBER
                                                   FROM (SELECT * FROM GAP_SIMULATION_AUTO ORDER BY OPER_DAY)
                                                   WHERE ROLE = '${role}')
                                      SELECT OPER_DAY
                                      FROM CTE
                                      WHERE ROW_NUMBER = ${date})`
  }
  await getData(updateQuery)
  await getData(`BEGIN GAP_MANUAL_REWRITER(); END;`)
  res.json({ success: true, message: 'updated' })
})

// @desc Update gap manual
// @route /gapmanual/saveChanges
// access Admin
export const saveGapChanges = asyncMiddleware(async (req: Request, res: Response) => {
  const query = `
       BEGIN
            DELETE FROM GAP_ANALYSIS_MANUAL WHERE 1=1;
            INSERT INTO GAP_ANALYSIS_MANUAL (SELECT * FROM GAP_SIMULATION_MANUAL);
            DELETE FROM GAP_SIMULATION_AUTO WHERE 1=1;
            INSERT INTO GAP_SIMULATION_AUTO (SELECT * FROM GAP_ANALYSIS_AUTO);
        END;
    `
  await getData(query)
  res.json({ success: true, message: 'changes saved' })
})
