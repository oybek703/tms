import useTypedSelector from './useTypedSelector'
import { useCallback, useEffect, useState } from 'react'
import { dateRegex, findRecursive } from '../utils'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

const useTwoDates = () => {
	const { reportDate, operDays } = useTypedSelector(state => state.operDays)
	const [firstDate, setFirstDate] = useState(reportDate)
	const [secondDate, setSecondDate] = useState(reportDate)
	useEffect(() => {
		const dayBefore = findRecursive(operDays, reportDate)
		let newSecondDate = format(new Date(reportDate), 'yyyy-MM-dd')
		const isReportDateToday = newSecondDate === format(new Date(), 'yyyy-MM-dd')
		if (isReportDateToday) {
			newSecondDate = findRecursive(operDays, new Date(newSecondDate))
			if (newSecondDate) {
				const newFirstDate = findRecursive(operDays, new Date(newSecondDate))
				setFirstDate(newFirstDate)
				setSecondDate(newSecondDate)
			}
		} else {
			setFirstDate(dayBefore)
			setSecondDate(newSecondDate)
		}
	}, [reportDate, operDays])

	const handleDateChange = useCallback(
		(id: string) => (date: string | null) => {
			let formattedDate: string
			try {
				formattedDate = date ? format(new Date(date), 'dd.MM.yyyy') : ''
			} catch (e: any) {
				formattedDate = e.message
			}
			if (date && dateRegex.test(formattedDate)) {
				formattedDate = format(new Date(date), 'yyyy-MM-dd')
				const formattedTodayDate = format(new Date(), 'yyyy-MM-dd')
				if (operDays.findIndex((d: string) => formattedDate === d) >= 0 && formattedTodayDate !== formattedDate) {
					if (id === 'first_date') {
						if (new Date(formattedDate) < new Date(String(secondDate))) {
							setFirstDate(formattedDate)
						} else {
							toast.error('Первое дата должно быть меньше второго.')
						}
					} else {
						if (new Date(String(firstDate)) < new Date(formattedDate)) {
							setSecondDate(formattedDate)
						} else {
							toast.error('Вторая дата должна быть больше первой.')
						}
					}
				}
			}
		},
		[firstDate, secondDate, operDays]
	)
	return { handleDateChange, firstDate, secondDate }
}

export default useTwoDates
