// DATE FORMATTER
export function formatDate(date: string) {
	const newDate = new Date(date)
	const dateYear = newDate.getFullYear() - 1
	const dateMonth = newDate.getMonth() + 1
	const dateDay = newDate.getDate()
	const yearFirstDate = `01.01.${dateYear + 1}`
	const monthFirstDate = `01.${formatForTen(dateMonth)}.${dateYear + 1}`
	const selectedDate = `${formatForTen(dateDay)}.${formatForTen(dateMonth)}.${dateYear + 1}`
	return { yearFirstDate, monthFirstDate, selectedDate }
}

export function formatOneDate(date: string): string {
	const newDate = new Date(date)
	const dateYear = newDate.getFullYear() - 1
	const dateMonth = newDate.getMonth() + 1
	const dateDay = newDate.getDate()
	return `${formatForTen(dateDay)}.${formatForTen(dateMonth)}.${dateYear + 1}`
}

export function isYearEnd(date: string) {
	return formatOneDate(date).includes('31.12.')
}

export function formatForTen(number: number) {
	return number < 10 ? `0${number}` : number
}
