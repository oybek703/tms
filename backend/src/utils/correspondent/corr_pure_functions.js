function createCorrespondentData(
    count, state, UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR,
                                 isTableHead, isNegative = false) {
    return {
        count, state,
        UZS: isNegative ? UZS : Math.abs(UZS),
        CNY: isNegative ? CNY : Math.abs(CNY),
        JPY: isNegative ? JPY : Math.abs(JPY),
        KZT: isNegative ? KZT : Math.abs(KZT),
        RUB: isNegative ? RUB : Math.abs(RUB),
        CHF: isNegative ? CHF : Math.abs(CHF),
        GBP: isNegative ? GBP : Math.abs(GBP),
        USD: isNegative ? USD : Math.abs(USD),
        EUR: isNegative ? EUR : Math.abs(EUR),
        isTableHead: Boolean(isTableHead)
    }
}

function corr_include(withText = false) {
    return {
        count: '',
        state: withText ? 'в том числе' : '_____________________',
        UZS: '',
        CNY: '',
        JPY: '',
        KZT: '',
        RUB: '',
        CHF: '',
        GBP: '',
        USD: '',
        EUR: '',
        isTableHead: false
    }
}

function getCorrespondentTotal(propertyName = 'total', ...args) {
    let total = 0.00
    args.forEach(arg => {
        total+=Number(arg[propertyName])
    })
    return Number(total.toFixed(2))
}

module.exports = {
    createCorrespondentData,
    corr_include,
    getCorrespondentTotal
}