import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import CorrespondentTable from '../../components/tables/CorrespondentTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions1 from '../../hooks/useActions1'

const Correspondent = () => {
	const { fetchCorrespondent, fetchCorrespondentCurrent } = useActions1()
	const { reportDate } = useTypedSelector(state => state.operDays)
	const {
		correspondent,
		loading,
		error,
		currentState,
		currentCorrespondent,
		currentCorrespondentLoading,
		currentCorrespondentError
	} = useTypedSelector(state => state.correspondent)
	let [correspondentData, setCorrespondentData] = useState(correspondent)
	useEffect(() => {
		if (currentState) {
			fetchCorrespondentCurrent()
			setCorrespondentData(currentCorrespondent)
		} else {
			fetchCorrespondent()
			setCorrespondentData(correspondent)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchCorrespondent, fetchCorrespondentCurrent, reportDate, currentState])
	useEffect(() => {
		if (!currentState) {
			setCorrespondentData(correspondent)
		} else {
			setCorrespondentData(currentCorrespondent)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [correspondent, currentCorrespondent])
	if (!correspondentData)
		correspondentData = {
			currencyRate: [],
			interbankDeposits: [],
			totalCash: []
		}
	return (
		<>
			<PageTitle title="Информация о ликвидных средствах банка" />
			{loading || (currentCorrespondentLoading && currentState) ? (
				<Loader />
			) : error || currentCorrespondentError ? (
				<Alert message={error || currentCorrespondentError} />
			) : (
				<CorrespondentTable currentState={currentState} rows={correspondentData} />
			)}
		</>
	)
}

export default Correspondent
