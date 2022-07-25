export function getGapTotal(months: any, ...args: any) {
  return new Array(13).fill('').map((_, index) => getGapByMonth(index, args))
}

export function getGapByMonth(monthIndex: any, args: any) {
  let TOTAL = 0; let NATIONAL_CURRENCY = 0; let FOREIGN_CURRENCY = 0; let USD = 0; let EUR = 0
  return args.reduce((acc: any, value: any) => {
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

export function getGapSubOrDivideByMonth(monthIndex: number, total: any, left: any,
    INDICATOR_NAME = 'Остаток ВЛА на конец месяца', divide = false) {
  function getSubByProp(prop: string) {
    if (divide) {
      return (left[monthIndex] || {})[prop] === 0 ?
            0 :
            ((total[monthIndex] || {})[prop] /
            (left[monthIndex] || {})[prop]) * 10
    }
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
