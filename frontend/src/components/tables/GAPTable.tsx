import React, { memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import { formatOneDate } from '../../utils'
import ExportButton from '../layout/ExportButton'
import { v4 as uuid } from 'uuid'
import { GapTableHead, InnerDataRows, TotalOrBoldRow, VerticalColumn } from '../layout/GapHelpers'
import GapChartsPart from '../layout/GapHelpers/GapChartsPart'

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
	return (
		<div>
			<TableContainer sx={{ mb: 2 }} component={Paper}>
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
			<GapChartsPart months={months} lcrData={lcrData} vlaLcrData={vlaLcrData} nsfrData={nsfrData} />
		</div>
	)
}

export default memo(GAPTable)
