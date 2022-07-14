function createCapitalData(first_row, name, total = '', isTableHead) {
    return {
        first_row,
        name,
        total: total == null ? 0.00 : divideTo100000(total),
        isTableHead
    }
}

function divideTo100000(number) {
    return Math.abs(Number((number/100000).toFixed(2)))
}

function getCapitalTotal(...args) {
    let total = 0.00
    args.forEach(arg => {
        total+=arg['total']
    })
    return total*100000
}

module.exports = {
    createCapitalData,
    divideTo100000,
    getCapitalTotal
}