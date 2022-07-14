function createLiqPointersData(
    count,
    state,
    total= 0 ,
    nat_curr = 0,
    for_curr=  0,
    usa_dollar =  0,
    evro = 0,
    isTableHead
) {
    return {
        count,
        state,
        total: Math.abs(total),
        nat_curr: Math.abs(nat_curr),
        for_curr: Math.abs(for_curr),
        usa_dollar: Math.abs(usa_dollar),
        evro: Math.abs(evro),
        isTableHead: Boolean(isTableHead)
    }
}

function liq_include () {
    return {
        count: '',
        state: 'в том числе:',
        total: '',
        nat_curr: '',
        for_curr: '',
        usa_dollar: '',
        evro: '',
        isTableHead: ''
    }
}

function getLiquidityTotal(propertyName = 'total', ...args) {
    let total = 0.00
    args.forEach(arg => {
        total+=Number(arg[propertyName])
    })
    return Number(total.toFixed(2))
}

module.exports = {
    createLiqPointersData,
    liq_include,
    getLiquidityTotal
}