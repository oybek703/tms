import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import BoldWithColor from '../helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import TableCap from '../helpers/TableCap'
import globalStyles from '../../styles/globalStyles'
import { Typography } from '@mui/material'
import palette from '../../styles/palette'
import { ISxStyles } from '../../interfaces/styles.interface'

const styles: ISxStyles = {
	tableContainer: {
		padding: 0,
		marginBottom: '20px'
	},
	verticalCellGridStyles: {
		...globalStyles.verticalText,
		transform: 'rotate(0) translateY(-40px)',
		writingMode: 'vertical-rl',
		textOrientation: 'upright'
	},
	verticalCellStyles: {
		backgroundColor: palette.primary,
		border: '0',
		color: '#fff'
	},
	titleTextStyles: {
		fontSize: 60,
		color: '#fff',
		fontWeight: 'bold'
	},
	bottomContainer: {
		display: 'grid',
		gridAutoFlow: 'column',
		gridTemplateColumns: 'minmax(1fr, auto)'
	},
	chartsContainer: {
		display: 'grid',
		gridAutoFlow: 'column',
		gridTemplateColumns: 'repeat(3, 1fr)'
	}
}

const VlaAndForTable = () => {
	const { vlaAndFor } = useTypedSelector(state => state.vlaAndFor)
	console.log(vlaAndFor)
	return (
		<Fragment>
			<TableContainer sx={styles.tableContainer} component={Paper}>
				<Table size="small" aria-label="a dense table">
					<TableCap rows={13} text={'млн.'} />
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell align="center">
								<Typography sx={styles.titleTextStyles}>ВЛА</Typography>
							</TableCell>
							<TableCell sx={styles.verticalCellStyles} />
							<TableCell align="center">
								<BoldWithColor>Доля в ВЛА (100%)</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в совокупном активе</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Итого</BoldWithColor>
							</TableCell>
							<TableCell sx={styles.verticalCellStyles} />
							<TableCell align="center">
								<BoldWithColor>Доля в ВЛА в нац. вал.</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в совокупном активе в нац. валюте</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Национальная валюта</BoldWithColor>
							</TableCell>
							<TableCell sx={styles.verticalCellStyles} />
							<TableCell align="center">
								<BoldWithColor>Доля в ВЛА в ин. вал.</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в совокупном активе в ин. валюте</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Иностранном валюте(долл.США)</BoldWithColor>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody></TableBody>
				</Table>
			</TableContainer>
		</Fragment>
	)
}

export default memo(VlaAndForTable)
