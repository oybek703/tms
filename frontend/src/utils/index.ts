import { format } from 'date-fns'

export function formatOneDate(date: string | Date) {
	const newDate = new Date(date)
	const dateYear = newDate.getFullYear() - 1
	const dateMonth = newDate.getMonth() + 1
	const dateDay = newDate.getDate()
	return `${formatForTen(dateDay)}.${formatForTen(dateMonth)}.${dateYear + 1}`
}

export function formatDate(date: string, isDashed = false) {
	const newDate = new Date(date)
	const dateYear = newDate.getFullYear()
	const dateMonth = newDate.getMonth() + 1
	const dateDay = newDate.getDate()
	let yearFirstDate = `01.01.${dateYear}`
	let monthFirstDate = `01.${formatForTen(dateMonth)}.${dateYear}`
	let selectedDate = `${formatForTen(dateDay)}.${formatForTen(dateMonth)}.${dateYear}`
	if (isDashed) {
		yearFirstDate = `${dateYear}-01-01`
		monthFirstDate = `${dateYear}-${formatForTen(dateMonth)}-01`
		selectedDate = `${dateYear}-${formatForTen(dateMonth)}-${formatForTen(dateDay)}`
	}
	return { yearFirstDate, monthFirstDate, selectedDate }
}

function formatForTen(number: number) {
	return number < 10 ? `0${number}` : number
}

export function formatNumber(number: number | string | undefined, isDash: boolean | string = false): string {
	if (isDash === 'e' && number === 0) return ' '
	if (isDash && number === 0) return '-'
	if (typeof number === 'string' && !number) return ''
	if (typeof number === 'string') number = +number
	return number?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || ' '
}

export function disableDays(date: string, dates: string[]) {
	return dates.findIndex(d => date === d) < 0
}

export function formatChartLegend(label: string, opts: any) {
	return label + ' - ' + formatNumber(opts.w.globals.series[opts.seriesIndex])
}

export function chartTooltip(currency = '') {
	return {
		y: {
			formatter: function (value: number) {
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

export function findRecursive(operDays: string[] = [], date: Date | string): any {
	if (operDays.length) {
		const dayBefore = new Date(new Date(date).getTime() - 86400000)
		const formattedDayBefore = format(dayBefore, 'yyyy-MM-dd')
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

export const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.\d{4}$/

export function mergeStyles<T>(...args: T[]): T {
	return Object.assign({}, ...args)
}
