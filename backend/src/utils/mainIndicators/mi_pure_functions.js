function createMainIndicatorsData (
    count, indicator_name, YEAR_BEGIN, MONTH_BEGIN, SELECTED_DATE, DIFFER, DIFFER_PERCENT, isTableHead
) {
    return {
        count,
        indicator_name,
        yearBegin: (YEAR_BEGIN || YEAR_BEGIN === 0) ? YEAR_BEGIN : 'no_data',
        monthBegin: (MONTH_BEGIN || MONTH_BEGIN === 0) ? MONTH_BEGIN : 'no_data',
        selectedDate: (SELECTED_DATE || SELECTED_DATE === 0) ? SELECTED_DATE : 'no_data',
        differ: DIFFER === undefined ? 'no_data' : DIFFER,
        differ_percent: `${DIFFER_PERCENT === undefined ? 'no_data' : `${fixToOne(DIFFER_PERCENT)}%`}`,
        isTableHead: Boolean(isTableHead)
    }
}

function getMainIndicatorsTotalData(...args) {
    let yearBegin = 0, monthBegin = 0, selectedDate = 0
    args.forEach(arg => {
        yearBegin+=Math.abs(arg['yearBegin'])
        monthBegin+=Math.abs(arg['monthBegin'])
        selectedDate+=Math.abs(arg['selectedDate'])
    })
    return {
        yearBegin: isNaN(yearBegin) ? 'no_data' : yearBegin,
        monthBegin: isNaN(monthBegin) ? 'no_data' : monthBegin,
        selectedDate: isNaN(selectedDate) ? 'no_data' : selectedDate,
        differ: isNaN(selectedDate) ? 'no_data' : fixToOne(selectedDate-monthBegin),
        differ_percent: isNaN(selectedDate) ? 'no_data' : `${fixToOne(((selectedDate/monthBegin)-1)*100)}%`
    }
}

function fixToOne(number) {
    return Number((number).toFixed(1))
}

function returnDiffer(indicator_name, total, left, isTableHead = false, isAbs = true) {
    let yearBegin = fixToOne(Math.abs(total['yearBegin'])-Math.abs(left['yearBegin']))
    let monthBegin = fixToOne(Math.abs(total['monthBegin'])-Math.abs(left['monthBegin']))
    let selectedDate = fixToOne(Math.abs(total['selectedDate'])-Math.abs(left['selectedDate']))
    if(!isAbs) {
        yearBegin = fixToOne(total['yearBegin']-left['yearBegin'])
        monthBegin = fixToOne(total['monthBegin']-left['monthBegin'])
        selectedDate = fixToOne(total['selectedDate']-left['selectedDate'])
    }
    return {
        indicator_name,
        yearBegin,
        monthBegin,
        selectedDate,
        differ: isNaN(selectedDate) ? 'no_data' : fixToOne(selectedDate-monthBegin),
        differ_percent: isNaN(selectedDate) ? 'no_data' : `${fixToOne(((selectedDate/monthBegin)-1)*100)}%`,
        isTableHead
    }
}

module.exports = {
    createMainIndicatorsData,
    getMainIndicatorsTotalData,
    returnDiffer
}