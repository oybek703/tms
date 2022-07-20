export function createLiqPointersData (
    count: string,
    state: string,
    total: number = 0,
    nat_curr: number = 0,
    for_curr: number = 0,
    usa_dollar: number = 0,
    evro: number = 0,
    isTableHead: boolean
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

export function liq_include () {
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

export function getLiquidityTotal (propertyName = 'total', ...args: any) {
    let total = 0.00
    args.forEach((arg: any) => {
        total += Number(arg[propertyName])
    })
    return Number(total.toFixed(2))
}
