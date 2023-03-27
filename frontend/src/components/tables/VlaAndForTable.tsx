import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import useTypedSelector from '../../hooks/useTypedSelector'
import TableCap from '../helpers/TableCap'
import globalStyles from '../../styles/globalStyles'
import { Typography } from '@mui/material'
import { ISxStyles } from '../../interfaces/styles.interface'
import { format } from 'date-fns'
import BoldWithColor from '../helpers/BoldWithColor'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../utils'
import { singleColouredRow } from './LiqPointersTable'

const styles: ISxStyles = {
	tableContainer: {
		padding: 0,
		marginBottom: '20px'
	},
	titleTextStyles: {
		fontSize: 60,
		color: '#fff',
		fontWeight: 'bold'
	}
}

const WhiteCell = () => {
	return <TableCell sx={{ backgroundColor: 'white', border: 'none' }} />
}

const VlaAndForTable = () => {
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { vlaAndFor } = useTypedSelector(state => state.vlaAndFor)
	const { liquidityAssets } = vlaAndFor
	return (
		<Fragment>
			<TableContainer sx={styles.tableContainer} component={Paper}>
				<Table size="small" aria-label="a dense table">
					<TableCap rows={11} text={'млн.'} />
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell rowSpan={2} />
							<TableCell rowSpan={2} align="center">
								<Typography sx={styles.titleTextStyles}>Активы</Typography>
							</TableCell>
							<TableCell colSpan={5} align="center">
								<Typography color="white" variant="h4">
									{format(new Date(reportDate), 'dd.MM.yyyy')}
								</Typography>
							</TableCell>
							<WhiteCell />
							<TableCell sx={{ fontSize: '24px', fontWeight: '550', color: 'white' }} colSpan={3} align="center">
								Текущий
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center">
								<BoldWithColor> Итого</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Национальная валюта</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Иностранная валюта в суммовом эквиваленте</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Долл. США</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Евро</BoldWithColor>
							</TableCell>
							<WhiteCell />
							<TableCell align="center">
								<BoldWithColor> Национальная валюта</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Иностранная валюта в суммовом эквиваленте</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Итого</BoldWithColor>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{liquidityAssets.map((row, index) => (
							<Fragment key={uuid()}>
								{row.indicatorName === singleColouredRow ? (
									<TableRow sx={{ backgroundColor: '#b4c6cf' }}>
										<TableCell align="center">
											<b>{index + 1}</b>
										</TableCell>
										<TableCell>
											<b>{row.indicatorName}</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.total)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.natCurr)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.forCurr)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.usaDollar)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.evro)}%</b>
										</TableCell>
										<WhiteCell />
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.currentNatCurr)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.currentForCurr)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.currentTotal)}%</b>
										</TableCell>
									</TableRow>
								) : (
									<TableRow hover>
										<TableCell align="center">{row['isTableHead'] ? <b>{index + 1}</b> : index + 1}</TableCell>
										<TableCell align="left">
											{row['isTableHead'] ? <b>{row.indicatorName}</b> : row.indicatorName}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? <b>{formatNumber(row.total)}</b> : formatNumber(row.total)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['natCurr'], true)}</b>
											) : (
												formatNumber(row['natCurr'], true)
											)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['forCurr'], true)}</b>
											) : (
												formatNumber(row['forCurr'], true)
											)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['usaDollar'], true)}</b>
											) : (
												formatNumber(row['usaDollar'], true)
											)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? <b>{formatNumber(row['evro'], true)}</b> : formatNumber(row['evro'], true)}
										</TableCell>
										<WhiteCell />
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['currentNatCurr'], true)}</b>
											) : (
												formatNumber(row['currentNatCurr'], true)
											)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['currentNatCurr'], true)}</b>
											) : (
												formatNumber(row['currentNatCurr'], true)
											)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['currentTotal'], true)}</b>
											) : (
												formatNumber(row['currentTotal'], true)
											)}
										</TableCell>
									</TableRow>
								)}
							</Fragment>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Fragment>
	)
}

export default memo(VlaAndForTable)
