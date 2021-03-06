export function createCorrespondentData(
    count: string, state: string, UZS: number, CNY: number, JPY: number,
    KZT: number, RUB: number, CHF: number, GBP: number,
    USD: number, EUR: number, isTableHead: boolean, isNegative: boolean = false) {
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

export function corrInclude(withText = false) {
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

export function getCorrespondentTotal(propertyName = 'total', ...args: any) {
  let total = 0.00
  args.forEach((arg: any) => {
    total+=Number(arg[propertyName])
  })
  return Number(total.toFixed(2))
}
