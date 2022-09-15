export function formatOneDate(date: string) {
  const newDate = new Date(date)
  const dateYear = newDate.getFullYear() - 1
  const dateMonth = newDate.getMonth() + 1
  const dateDay = newDate.getDate()
  return `${formatForTen(dateDay)}.${formatForTen(dateMonth)}.${dateYear + 1}`
}

export function formatDateWithDash(pointedDate: string) {
  if (pointedDate) {
    const [day, month, year] = pointedDate.split('.')
    return `${year}-${month}-${day}`
  }
}

export function formatDate(date: string, isDashed = false) {
  const newDate = new Date(date)
  const dateYear = newDate.getFullYear()
  const dateMonth = newDate.getMonth() + 1
  const dateDay = newDate.getDate()
  let yearFirstDate = `01.01.${dateYear}`
  let monthFirstDate = `01.${formatForTen(dateMonth)}.${dateYear}`
  let selectedDate = `${formatForTen(dateDay)}.${formatForTen(
      dateMonth)}.${dateYear}`
  if (isDashed) {
    yearFirstDate = `${dateYear}-01-01`
    monthFirstDate = `${dateYear}-${formatForTen(dateMonth)}-01`
    selectedDate = `${dateYear}-${formatForTen(dateMonth)}-${formatForTen(
        dateDay)}`
  }
  return { yearFirstDate, monthFirstDate, selectedDate }
}

function formatForTen(number: number) {
  return number < 10 ? `0${number}` : number
}

export function formatNumber(number: number, isDash: boolean | string = false) {
  if (isNaN(number)) return '-'
  if (isDash === 'e' && number === 0) return ' '
  if (isDash && number === 0) return '-'
  if (typeof number !== 'number') return number
  if (number === 0) return '0.00'
  const integerPart = Math.trunc(number)
  const decimalPart = (number - integerPart).toFixed(2).slice(2)
  // @ts-ignore
  const formatted = [...`${integerPart}`].reverse().
      reduce((acc, v, i) => acc.push((i + 1) % 3 === 0 ? ' ' + v : v) && acc, []).
      reverse().
      join('').
      trim()
  return `${number < 0 && formatted === '0' ?
    '-0' :
    formatted}${decimalPart.includes('.') ? decimalPart : `.${decimalPart}`}`
}

export function disableDays(date: string, dates: string[]) {
  return dates.findIndex((d) => formatOneDate(date) === d) < 0
}

export function formatChartLegend(label: string, opts: any) {
  return label + ' - ' + formatNumber(opts.w.globals.series[opts.seriesIndex])
}

export function chartTooltip(currency = '') {
  return {
    y: {
      formatter: function(value: number) {
        return `${formatNumber(value)} ${currency}`
      }
    }
  }
}

export function chartTitle(text = '') {
  return {
    text,
    align: 'center',
    style: {
      fontSize: 17,
      fontWeight: '400',
      fontFamily: 'Poppins'
    }
  }
}

export function chartSubtitle(text = 'млрд.сум') {
  return {
    text,
    align: 'right',
    style: {
      fontSize: 13,
      color: '#8b8989'
    }
  }
}

export function findRecursive(operDays: string[] = [], date: Date): any {
  if (operDays.length) {
    const dayBefore = new Date(new Date(date).getTime() - 86400000)
    const formattedDayBefore = formatOneDate(`${dayBefore}`)
    if (operDays.indexOf(formattedDayBefore) >= 0) {
      return formattedDayBefore
    }
    const found = findRecursive(operDays, dayBefore)
    if (found) return found
  }
}

export function getErrorMessage(e: any) {
  const { response = {} } = e
  const { data = {} } = response
  const { message = 'Internal server error!' } = data
  return message
}

export function getDashboardLiquidityIndicator(data: any) {
  const { total = [], nat = [], foreign = [] } = data
  const lastTotal = [...total].pop()
  const lastNat = [...nat].pop()
  const lastForeign = [...foreign].pop()
  return [lastTotal, lastNat, lastForeign]
}
