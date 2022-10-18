import React, { Fragment, memo, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import { formatOneDate } from '../../utils'
import ExportButton from '../UI/Layout/ExportButton'
import { v4 as uuid } from 'uuid'
import { GapTableHead, InnerDataRows, LcrAndNsfrTable, TotalOrBoldRow, VerticalColumn } from '../UI/Layout/GapHelpers'
import useActions from '../../hooks/useActions'
import { Grid } from '@mui/material'
import DeficitChart from '../charts/GAP/DeficitChart'

const GAPTable: React.FC<{ rows: any }> = function ({ rows = {} }) {
	const {
		months = [],
		sourceOfLiquidity = [],
		sourceOfLiquidityTotal = [],
		needsOfLiquidity = [],
		needsOfLiquidityTotal = [],
		vlaLcrData = [],
		lcrData = [],
		nsfrData = []
	} = rows
	const { getLastGapUpdate } = useActions()
	const foreignCurrency =
		vlaLcrData.length > 0 ? vlaLcrData[2].slice(0, 6).map((e: any) => Number(e['FOREIGN_CURRENCY'].toFixed(2))) : []
	const nationalCurrency =
		vlaLcrData.length > 0 ? vlaLcrData[2].slice(0, 6).map((e: any) => Number(e['NATIONAL_CURRENCY'].toFixed(2))) : []
	const totalCurrency =
		vlaLcrData.length > 0 ? vlaLcrData[2].slice(0, 6).map((e: any) => Number(e['TOTAL'].toFixed(2))) : []

	useEffect(() => {
		getLastGapUpdate()
	}, [getLastGapUpdate])

	return (
		<div>
			<TableContainer component={Paper}>
				<ExportButton id={`gap-${formatOneDate(new Date().toString())}`} />
				<Table id={`gap-${formatOneDate(new Date().toString())}`} size="small" aria-label="a dense table">
					<GapTableHead months={months} />
					<TableBody>
						<VerticalColumn data={sourceOfLiquidity} text="приток" />
						<InnerDataRows data={sourceOfLiquidity} months={months} />
						<TotalOrBoldRow blueBackground months={months} total={sourceOfLiquidityTotal} />
						<VerticalColumn data={needsOfLiquidity} text="отток" />
						<InnerDataRows data={needsOfLiquidity} months={months} />
						<TotalOrBoldRow blueBackground months={months} total={needsOfLiquidityTotal} />
						{vlaLcrData.map((row: any, index: number) => (
							<TotalOrBoldRow
								withPercent={index === 3}
								blueBackground={index === 3}
								key={uuid()}
								align="left"
								months={months}
								total={row}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<br />
			<Grid
				sx={{
					display: 'grid',
					gridTemplateColumns: '[start] 1fr [middle] 1fr [end]',
					gap: '20px',
					gridTemplateRows: '[start] auto [middle1] auto [end]'
				}}
			>
				<LcrAndNsfrTable month={months[1]} data={lcrData} />
				<DeficitChart
					series={foreignCurrency}
					id={'for_value'}
					title={'Сумма отклонения(дефицит) на конец месяца (Ин.вал. (USD екв.))'}
					categories={months.slice(0, 6)}
				/>
				<LcrAndNsfrTable data={nsfrData} month={months[1]} />
				<Grid sx={{ display: 'grid', rowGap: '20px' }}>
					<DeficitChart
						id={'nat_value'}
						series={nationalCurrency}
						title={'Сумма отклонения(дефицит) на конец месяца (Нац.вал. (UZS))'}
						categories={months.slice(0, 6)}
					/>
					<DeficitChart
						id={'total_value'}
						title={'Итого сумма отклонения(дефицит) на конец месяца'}
						series={totalCurrency}
						categories={months.slice(0, 6)}
					/>
				</Grid>
			</Grid>
		</div>
	)
}

export default memo(GAPTable)
