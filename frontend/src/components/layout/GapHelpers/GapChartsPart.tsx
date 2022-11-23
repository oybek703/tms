import { LcrAndNsfrTable } from './index'
import DeficitChart from '../../charts/GAP/DeficitChart'
import { Grid } from '@mui/material'
import React from 'react'

interface IGapCharts {
	vlaLcrData: any
	months: any
	lcrData: any
	nsfrData: any
}

const GapChartsPart: React.FC<IGapCharts> = ({ vlaLcrData, lcrData, nsfrData, months }) => {
	const foreignCurrency =
		vlaLcrData.length > 0 ? vlaLcrData[2].slice(0, 6).map((e: any) => Number(e['foreignCurrency'].toFixed(2))) : []
	const nationalCurrency =
		vlaLcrData.length > 0 ? vlaLcrData[2].slice(0, 6).map((e: any) => Number(e['nationalCurrency'].toFixed(2))) : []
	const totalCurrency =
		vlaLcrData.length > 0 ? vlaLcrData[2].slice(0, 6).map((e: any) => Number(e['total'].toFixed(2))) : []
	return (
		<Grid
			sx={{
				display: 'grid',
				gridTemplateColumns: '[start] 1fr [middle] 1fr [end]',
				gap: '20px',
				gridTemplateRows: '[start] auto [middle1] auto [end]',
				mt: 2
			}}
		>
			<LcrAndNsfrTable month={months[1]} data={lcrData} />
			<DeficitChart
				series={foreignCurrency}
				id={'for_value'}
				title={'Сумма отклонения (дефицит) на конец месяца (Ин.вал. (USD екв.))'}
				categories={months.slice(0, 6)}
			/>
			<LcrAndNsfrTable data={nsfrData} month={months[1]} />
			<Grid sx={{ display: 'grid', rowGap: '20px' }}>
				<DeficitChart
					id={'nat_value'}
					series={nationalCurrency}
					title={'Сумма отклонения (дефицит) на конец месяца (Нац.вал. (UZS))'}
					categories={months.slice(0, 6)}
				/>
				<DeficitChart
					id={'total_value'}
					title={'Итого сумма отклонения (дефицит) на конец месяца'}
					series={totalCurrency}
					categories={months.slice(0, 6)}
				/>
			</Grid>
		</Grid>
	)
}

export default GapChartsPart
