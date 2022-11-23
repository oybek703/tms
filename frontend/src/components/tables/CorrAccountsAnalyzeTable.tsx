import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import ExportButton from '../layout/ExportButton'
import useTypedSelector from '../../hooks/useTypedSelector'
import { ICorrAccountsAnalyze } from '../../interfaces/caa.interfaces'
import CorrAccountsHead from '../helpers/corrAccountsHead'
import { v4 as uuid } from 'uuid'
import { TableCell, TableRow } from '@mui/material'
import globalStyles from '../../styles/globalStyles'

interface CorrAccountsTableProps {
	rows: ICorrAccountsAnalyze[]
}

const CorrAccountsAnalyzeTable: React.FC<CorrAccountsTableProps> = ({ rows }) => {
	const { reportDate } = useTypedSelector(state => state.operDays)
	return (
		<TableContainer component={Paper}>
			<ExportButton id={`corr-accounts-${reportDate}`} />
			<Table id={`corr-accounts-${reportDate}`} size="small" aria-label="a dense table">
				<CorrAccountsHead />
				<TableBody>
					{rows.map(({ codeCurrency, banks }) => (
						<Fragment key={uuid()}>
							<TableRow>
								<TableCell colSpan={2} align="center">
									<b>{codeCurrency}</b>
								</TableCell>
								<TableCell colSpan={17} />
							</TableRow>
							{banks.map((bank, index) => (
								<TableRow key={uuid()}>
									<TableCell align="center">{index + 1}</TableCell>
									<TableCell sx={globalStyles.noWrap}>
										<b>{bank.bankName} </b>
									</TableCell>
									<TableCell align="center">{bank.countryCode}</TableCell>
									<TableCell align="center">{bank.imports}</TableCell>
									<TableCell align="center">{bank.exports}</TableCell>
									<TableCell align="center">{bank.tradingFin}</TableCell>
									<TableCell align="center">{bank.mbd}</TableCell>
									<TableCell align="center">{bank.fx}</TableCell>
									<TableCell align="center">{bank.creditLine}</TableCell>
									<TableCell align="center">{bank.vostro}</TableCell>
									<TableCell align="center">{bank.otherOperations}</TableCell>
									<TableCell align="center">{bank.corrAccounts}</TableCell>
									<TableCell align="center">{bank.genAgreement}</TableCell>
									<TableCell align="center">{bank.isda}</TableCell>
									<TableCell align="center">{bank.otherAgreement}</TableCell>
									<TableCell align="center">{bank.serviceSize}</TableCell>
									<TableCell align="center">{bank.serviceSpeed}</TableCell>
									<TableCell align="center">{bank.serviceQuality}</TableCell>
									<TableCell align="center">{bank.serviceCost}</TableCell>
								</TableRow>
							))}
						</Fragment>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(CorrAccountsAnalyzeTable)
