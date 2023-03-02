import React, { Fragment, useEffect, useState } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import ReportLiabilitiesTable from '../../components/tables/ReportLiabilitiesTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'
import { toast } from 'react-toastify'
import axios from 'axios'
import { APIRoutes } from '../../interfaces/apiRoutes.interface'
import { withToken } from '../../utils/axiosUtils'
import Divider from '@mui/material/Divider'
import { utils, writeFile } from 'sheetjs-style'

function RL216() {
	const [date, setDate] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)

	async function handleRL216() {
		if (!date) return toast.error('Выберите дату')
		try {
			setLoading(true)
			const { data } = await axios(`${APIRoutes.reportLiabilities216}?date=${date}`, withToken())
			setLoading(false)
			const workSheet = utils.json_to_sheet(data)
			const workBook = utils.book_new()
			utils.book_append_sheet(workBook, workSheet, `report-liabilities-${date}`)
			writeFile(workBook, `report-${date}.xlsx`)
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.message)
				setError(e.message)
			}
		}
	}

	return (
		<fieldset>
			<legend>График 216-220</legend>
			<input disabled={loading} type="date" value={date} onChange={({ target: { value } }) => setDate(value)} />
			&nbsp; &nbsp;
			<button disabled={loading} onClick={handleRL216}>
				{loading && !error ? 'Подождите...' : 'Экспорт в excel'}
			</button>{' '}
		</fieldset>
	)
}

const ReportLiabilities = () => {
	const { fetchReportLiabilities } = useActions()
	const { loading, error } = useTypedSelector(state => state.reportLiabilities)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchReportLiabilities()
	}, [reportDate, fetchReportLiabilities])
	return (
		<>
			<PageTitle title="Отчет об обязательствах" />
			<LoaderWrapper loading={loading} error={error}>
				<ReportLiabilitiesTable />
				<Divider sx={{ marginTop: '10px' }} />
				<RL216 />
			</LoaderWrapper>
		</>
	)
}

export default ReportLiabilities
