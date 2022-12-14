import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import CorrespondentTable from '../../components/tables/CorrespondentTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const Correspondent = () => {
	const { fetchCorrespondent, fetchCorrespondentCurrent } = useActions()
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
			<LoaderWrapper
				loading={loading || (currentCorrespondentLoading && currentState)}
				error={error || currentCorrespondentError}
			>
				<CorrespondentTable rows={correspondentData} currentState={currentState} />
			</LoaderWrapper>
		</>
	)
}

export default Correspondent
