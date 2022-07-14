function getGapTotal(months, ...args) {
    return new Array(13).fill('').map((_, index) => getGapByMonth(index, args))
}

function getGapByMonth(monthIndex, args) {
    let TOTAL = 0, NATIONAL_CURRENCY = 0, FOREIGN_CURRENCY = 0, USD = 0, EUR = 0
    return args.reduce((acc, value) => {
        if (value[monthIndex]) {
            TOTAL += value[monthIndex]['TOTAL']
            NATIONAL_CURRENCY += value[monthIndex]['NATIONAL_CURRENCY']
            FOREIGN_CURRENCY += value[monthIndex]['FOREIGN_CURRENCY']
            USD += value[monthIndex]['USD']
            EUR += value[monthIndex]['EUR']
        }
        return {
            ...value[monthIndex],
            INDICATOR_NAME: 'Итого',
            TOTAL, NATIONAL_CURRENCY, FOREIGN_CURRENCY, USD, EUR
        }
    }, {})
}

function getGapSubOrDivideByMonth(monthIndex, total, left,
                                  INDICATOR_NAME = 'Остаток ВЛА на конец месяца', divide = false) {
    function getSubByProp(prop) {
        if(divide) return (left[monthIndex] || {})[prop] === 0 ? 0 : ((total[monthIndex] || {})[prop] / (left[monthIndex] || {})[prop]) * 10
        return (total[monthIndex] || {})[prop] - (left[monthIndex] || {})[prop]
    }
    return {
        ...total[monthIndex],
        INDICATOR_NAME,
        TOTAL: getSubByProp('TOTAL'),
        NATIONAL_CURRENCY: getSubByProp('NATIONAL_CURRENCY'),
        FOREIGN_CURRENCY: getSubByProp('FOREIGN_CURRENCY'),
        USD: getSubByProp('USD'), EUR: getSubByProp('EUR')
    }
}

module.exports = {
    getGapTotal, getGapSubOrDivideByMonth
}