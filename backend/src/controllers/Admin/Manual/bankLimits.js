const asyncMiddleware = require('../../../utils/async')
const {getData} = require('../../../models/db_apis')


// @desc Get limit of banks dates
// @route /banklimits/dates
// access Admin
exports.getBankLimits = asyncMiddleware(async (req, res) => {
    const {rows: dates} = await getData(`SELECT UNIQUE TO_CHAR(DATE_BEGIN, 'yyyy-MM-dd') BEGIN,
                                                       TO_CHAR(DATE_END, 'yyyy-MM-dd')   END
                                         FROM LIMIT_OF_BANKS`)
    const {rows: tableData} = await getData(`SELECT CLIENT_CODE,
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
    res.json({success: true, data: {dates, tableData}})
})

// @desc Update limit of banks dates
// @route /banklimits/updateDates
// access Admin
exports.updateDates = asyncMiddleware(async (req, res) => {
    const {beginDate, endDate} = req.body
    await getData(`UPDATE LIMIT_OF_BANKS SET DATE_BEGIN=DATE '${beginDate}' where 1=1`)
    await getData(`UPDATE LIMIT_OF_BANKS SET DATE_END=DATE '${endDate}' where 1=1`)
    res.json({success: true, message: 'updated'})
})

// @desc Update bank limit value
// @route /banklimits/updateLimit
// access Admin
exports.updateLimit = asyncMiddleware(async (req, res) => {
    const {code, currency, newLimit} = req.body
    await getData(`UPDATE LIMIT_OF_BANKS SET ${currency}=${+newLimit}
                     WHERE CLIENT_CODE='${code}'`)
    res.json({success: true, message: 'updated'})
})

