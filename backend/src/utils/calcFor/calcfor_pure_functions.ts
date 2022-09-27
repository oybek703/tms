export const getDatesBetweenDates = (startDate: string, endDate: string) => {
	let dates: any = []
	const theDate = new Date(startDate)
	while (theDate <= new Date(endDate)) {
		dates = [...dates, new Date(theDate)]
		theDate.setDate(theDate.getDate() + 1)
	}
	return dates
}
