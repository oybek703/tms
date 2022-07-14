const asyncMiddleware = require('../../../utils/async')
const GapSimulation = require('./GapSimulation')
const {getData} = require('../../../models/db_apis')


// @desc Get gap manual data
// @route /gapmanual
// access Admin
exports.getGapManual = asyncMiddleware(async (req, res) => {
    let {forEditing} = req.query
    forEditing = forEditing === 'true'
    if(!forEditing) await getData(`
        BEGIN
            DELETE FROM GAP_SIMULATION_AUTO WHERE 1=1;
            DELETE FROM GAP_SIMULATION_MANUAL WHERE 1=1;
            INSERT INTO GAP_SIMULATION_AUTO (SELECT * FROM GAP_ANALYSIS_AUTO);
            INSERT INTO GAP_SIMULATION_MANUAL (SELECT * FROM GAP_ANALYSIS_MANUAL);
        END;
    `)
    const gapManualData = await (new GapSimulation(forEditing).getRows())
    res.json({success: true, data: gapManualData})
})

// @desc Get gap manual update
// @route /gapmanual/update
// access Admin
exports.updateGapManual = asyncMiddleware(async (req, res) => {
    const {colName, newValue, role, date, source} = req.body
    let updateQuery = `UPDATE GAP_SIMULATION_MANUAL SET ${colName}=${+newValue} 
                       WHERE ROLE='${role}' AND OPER_DAY=${date}`
    if (source === 'AUTO') updateQuery = `UPDATE GAP_SIMULATION_AUTO
                                            SET ${colName}=${+newValue}
                                            WHERE ROLE = '${role}'
                                            AND OPER_DAY = (WITH CTE AS (SELECT * FROM GAP_SIMULATION_AUTO WHERE ROLE = '${role}' ORDER BY OPER_DAY)
                                                          SELECT OPER_DAY
                                                          FROM CTE
                                                          WHERE ROWNUM = ${date})`
    await getData(updateQuery)
    await getData(`BEGIN GAP_MANUAL_REWRITER(); END;`)
    res.json({success: true, message: 'updated'})
})

// @desc Update gap manual
// @route /gapmanual/saveChanges
// access Admin
exports.saveGapChanges = asyncMiddleware(async (req, res) => {
    await getData(`
       BEGIN
            DELETE FROM GAP_ANALYSIS_MANUAL WHERE 1=1;
            DELETE FROM GAP_SIMULATION_AUTO WHERE 1=1;
            INSERT INTO GAP_ANALYSIS_MANUAL (SELECT * FROM GAP_SIMULATION_MANUAL);
            INSERT INTO GAP_SIMULATION_AUTO (SELECT * FROM GAP_ANALYSIS_AUTO);
        END;
    `)
    res.json({success: true, message: 'changes saved'})
})