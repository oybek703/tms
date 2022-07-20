import { StringOrNumber } from '../mainIndicators/mi_pure_functions'

export function createCapitalData(first_row?: string, name?: string, total: StringOrNumber = '',
    isTableHead?: boolean) {
    return {
        first_row,
        name,
        total: total == null ? 0.00 : divideTo100000(+total),
        isTableHead
    }
}

function divideTo100000(number: number) {
    return Math.abs(Number((number/100000).toFixed(2)))
}

export function getCapitalTotal(...args: {total: number}[]) {
    let total = 0.00
    args.forEach(arg => {
        total+=arg['total']
    })
    return total*100000
}
