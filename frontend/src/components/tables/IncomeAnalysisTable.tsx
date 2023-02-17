import React, { Fragment, memo, useCallback, useState } from 'react'
import useTypedSelector from '../../hooks/useTypedSelector'
import ButtonTabs from '../layout/Tabs/ButtonsTab'
import IncomePoints from '../charts/incomeAnalysis/IncomePoints'
import { v4 as uuid } from 'uuid'
import { Grid } from '@mui/material'
import { ISxStyles } from '../../interfaces/styles.interface'
import palette from '../../styles/palette'
import { IIncomeData } from '../../interfaces/IncomeAnalysis.interfaces'

enum Titles {
	income = 'Анализ процентного дохода',
	incomeNoPercent = 'Анализ беспроцентного дохода',
	consumption = 'Анализ процентного расхода',
	consumptionNoPercent = 'Анализ беспроцентного дохода(в.т.ч. операционний расход)'
}

const titles = [
	{ title: Titles.income, code: 'income' },
	{ title: Titles.incomeNoPercent, code: 'incomeNoPercent' },
	{ title: Titles.consumption, code: 'consumption' },
	{ title: Titles.consumptionNoPercent, code: 'consumptionNoPercent' }
]

const styles: ISxStyles = {
	main: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1fr)',
		gap: '15px',
		marginRight: '20px'
	}
}

const getColor = (index: number) => {
	switch (index) {
		case 0:
			return palette.darkYellow
		case 1:
			return palette.lightBlue
		case 2:
			return palette.lightGreen
		case 3:
			return palette.lightRed
		case 4:
			return palette.lightBrown
		default:
			return palette.primary
	}
}

function ExpandedTab({ dataArray, idStart }: { dataArray: IIncomeData[]; idStart: string }) {
	return (
		<Fragment>
			{dataArray && (
				<Grid sx={styles.main}>
					{dataArray.map(({ title, data }, index) => (
						<Grid key={uuid()}>
							<IncomePoints color={getColor(index)} title={title} id={`${idStart}_${index + 1}`} data={data} />
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

const IncomeAnalysisTable = function () {
	const { incomeAnalysis } = useTypedSelector(state => state.incomeAnalysis)
	const [expanded, setExpanded] = useState<keyof typeof Titles | string>('income')
	const handleChange = useCallback((code: string) => setExpanded(code), [])
	const { income, incomeNoPercent, consumption, consumptionNoPercent } = incomeAnalysis
	return (
		<Fragment>
			<ButtonTabs handleChange={handleChange} active={expanded} titles={titles} />
			{expanded === 'income' && <ExpandedTab dataArray={income} idStart={'income'} />}
			{expanded === 'incomeNoPercent' && <ExpandedTab dataArray={incomeNoPercent} idStart={'incomeNoPercent'} />}
			{expanded === 'consumption' && <ExpandedTab dataArray={consumption} idStart={'consumption'} />}
			{expanded === 'consumptionNoPercent' && (
				<ExpandedTab dataArray={consumptionNoPercent} idStart={'consumptionNoPercent'} />
			)}
		</Fragment>
	)
}

export default memo(IncomeAnalysisTable)
