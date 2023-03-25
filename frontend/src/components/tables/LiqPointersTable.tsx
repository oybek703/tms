import React, { memo } from 'react'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatOneDate } from '../../utils'
import TableCap from '../helpers/TableCap'
import ExportButton from '../layout/ExportButton'
import BoldWithColor from '../helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import globalStyles from '../../styles/globalStyles'
import RenderLiquidityBody from '../helpers/RenderLiquidityBody'

interface LiqPointersTableProps {
	rows: any
	currentState: boolean
}

export const singleColouredRow = 'Доля высоколиквидных активов в %'

const LiqPointersTable: React.FC<LiqPointersTableProps> = function ({ rows = {}, currentState = false }) {
	const { liquidityAssets = [], obligations = [] } = rows
	const { reportDate } = useTypedSelector(state => state.operDays)
	return (
		<TableContainer component={Paper}>
			<ExportButton id={`liquidity-pointers-${currentState ? 'realtime' : formatOneDate(reportDate)}`} />
			<Table
				size="small"
				id={`liquidity-pointers-${currentState ? 'realtime' : formatOneDate(reportDate)}`}
				tableexport-key={`liquidity-pointers-${currentState ? 'realtime' : formatOneDate(reportDate)}`}
				aria-label="a dense table"
			>
				<TableCap rows={7} text={'млн.сум'} />
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell align="center">
							<BoldWithColor>№</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Статья баланса</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Итого</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>
								Национальная <br /> валюта
							</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>
								Иностранная валюта <br /> в суммовом эквиваленте
							</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Долл. США</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Евро</BoldWithColor>
						</TableCell>
					</TableRow>
				</TableHead>
				{/* ЛИКВИДНЫЕ АКТИВЫ*/}
				<RenderLiquidityBody tableData={liquidityAssets} />
				{/* ОБЯЗАТЕЛЬСТВА ДО ВОСТРЕБОВАНИЯ*/}
				<RenderLiquidityBody tableData={obligations} />
			</Table>
		</TableContainer>
	)
}

export default memo(LiqPointersTable)
