export type StringOrNumber = string | number

export function createMainIndicatorsData (
    count: string, indicator_name: string, YEAR_BEGIN: StringOrNumber,
    MONTH_BEGIN: StringOrNumber,
    SELECTED_DATE: StringOrNumber, DIFFER: string, DIFFER_PERCENT: number,
    isTableHead?: boolean
) {
    return {
        count,
        indicator_name,
        yearBegin: (YEAR_BEGIN || YEAR_BEGIN === 0) ? YEAR_BEGIN : 'no_data',
        monthBegin: (MONTH_BEGIN || MONTH_BEGIN === 0)
            ? MONTH_BEGIN
            : 'no_data',
        selectedDate: (SELECTED_DATE || SELECTED_DATE === 0)
            ? SELECTED_DATE
            : 'no_data',
        differ: DIFFER === undefined ? 'no_data' : DIFFER,
        differ_percent: `${DIFFER_PERCENT === undefined
            ? 'no_data'
            : `${fixToOne(DIFFER_PERCENT)}%`}`,
        isTableHead: Boolean(isTableHead)
    }
}

export function getMainIndicatorsTotalData (...args: Total[]) {
    let yearBegin = 0, monthBegin = 0, selectedDate = 0
    args.forEach(arg => {
        yearBegin += Math.abs(arg['yearBegin'])
        monthBegin += Math.abs(arg['monthBegin'])
        selectedDate += Math.abs(arg['selectedDate'])
    })
    return {
        yearBegin: isNaN(yearBegin) ? 'no_data' : yearBegin,
        monthBegin: isNaN(monthBegin) ? 'no_data' : monthBegin,
        selectedDate: isNaN(selectedDate) ? 'no_data' : selectedDate,
        differ: isNaN(selectedDate) ? 'no_data' : fixToOne(
            selectedDate - monthBegin),
        differ_percent: isNaN(selectedDate) ? 'no_data' : `${fixToOne(
            ((selectedDate / monthBegin) - 1) * 100)}%`
    }
}

export function fixToOne (number: number) {
    return Number((number).toFixed(1))
}

interface Total {
    yearBegin: number
    monthBegin: number
    selectedDate: number
}

export function returnDiffer (
    indicator_name: string, total: Total, left: Total,
    isTableHead: boolean = false, isAbs: boolean = true) {
    let yearBegin = fixToOne(
        Math.abs(total['yearBegin']) - Math.abs(left['yearBegin']))
    let monthBegin = fixToOne(
        Math.abs(total['monthBegin']) - Math.abs(left['monthBegin']))
    let selectedDate = fixToOne(
        Math.abs(total['selectedDate']) - Math.abs(left['selectedDate']))
    if (!isAbs) {
        yearBegin = fixToOne(total['yearBegin'] - left['yearBegin'])
        monthBegin = fixToOne(total['monthBegin'] - left['monthBegin'])
        selectedDate = fixToOne(total['selectedDate'] - left['selectedDate'])
    }
    return {
        indicator_name,
        yearBegin,
        monthBegin,
        selectedDate,
        differ: isNaN(selectedDate) ? 'no_data' : fixToOne(
            selectedDate - monthBegin),
        differ_percent: isNaN(selectedDate) ? 'no_data' : `${fixToOne(
            ((selectedDate / monthBegin) - 1) * 100)}%`,
        isTableHead
    }
}