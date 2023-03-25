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
import { Grid, Typography } from '@mui/material'
import { ISxStyles } from '../../interfaces/styles.interface'
import { format } from 'date-fns'
import BoldWithColor from '../helpers/BoldWithColor'
import RenderLiquidityBody from '../helpers/RenderLiquidityBody'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../utils'

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

const VlaAndForTable = () => {
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { vlaAndFor } = useTypedSelector(state => state.vlaAndFor)
	const { liquidityAssets, activesCurrent } = vlaAndFor
	return (
		<Fragment>
			<Grid sx={{ display: 'grid', gridAutoFlow: 'column', gap: '20px', gridTemplateColumns: '65% 34% 1%' }}>
				<Grid>
					<TableContainer sx={styles.tableContainer} component={Paper}>
						<Table size="small" aria-label="a dense table">
							<TableCap rows={7} text={'млн.'} />
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
								</TableRow>
							</TableHead>
							<RenderLiquidityBody tableData={liquidityAssets} />
						</Table>
					</TableContainer>
				</Grid>
				<Grid>
					<TableContainer sx={styles.tableContainer} component={Paper}>
						<Table size="small" aria-label="a dense table">
							<TableCap rows={3} text={'млн.'} />
							<TableHead sx={globalStyles.stickyTableHead}>
								<TableRow>
									<TableCell colSpan={3} align="center">
										<Typography color="white" sx={{ fontSize: '24px' }}>
											Текущий
										</Typography>
									</TableCell>
								</TableRow>
								<TableRow>
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
								{activesCurrent.map(({ total, natCurr, forCurr }) => (
									<TableRow key={uuid()}>
										<TableCell sx={globalStyles.noWrap} align="center">
											{formatNumber(natCurr)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{formatNumber(forCurr)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{formatNumber(total)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
				<Grid />
			</Grid>
		</Fragment>
	)
}

export default memo(VlaAndForTable)
