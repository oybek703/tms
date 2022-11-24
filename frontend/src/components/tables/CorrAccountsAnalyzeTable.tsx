import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import ExportButton from '../layout/ExportButton'
import useTypedSelector from '../../hooks/useTypedSelector'
import { ICorrAccountsAnalyze } from '../../interfaces/caa.interfaces'
import CorrAccountsHeadAnalyzeHead from '../helpers/corrAccountsAnalyze/CorrAccountsHeadAnalyzeHead'
import { v4 as uuid } from 'uuid'
import { TableCell, TableRow } from '@mui/material'
import globalStyles from '../../styles/globalStyles'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import palette from '../../styles/palette'

interface CorrAccountsTableProps {
	rows: ICorrAccountsAnalyze[]
}

const CorrAccountsAnalyzeTable: React.FC<CorrAccountsTableProps> = ({ rows }) => {
	const { reportDate } = useTypedSelector(state => state.operDays)
	return (
		<TableContainer component={Paper}>
			<ExportButton id={`corr-accounts-${reportDate}`} />
			<Table id={`corr-accounts-${reportDate}`} size="small" aria-label="a dense table">
				<CorrAccountsHeadAnalyzeHead />
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
									<TableCell align="center">
										{bank.countryCode === '1' ? <CheckBoxIcon sx={{ color: palette.lightGreen }} /> : bank.countryCode}
									</TableCell>
									<TableCell align="center">
										{bank.imports === '1' ? <CheckBoxIcon sx={{ color: palette.lightGreen }} /> : bank.imports}
									</TableCell>
									<TableCell align="center">
										{bank.exports === '1' ? <CheckBoxIcon sx={{ color: palette.lightGreen }} /> : bank.exports}
									</TableCell>
									<TableCell align="center">
										{bank.tradingFin === '1' ? <CheckBoxIcon sx={{ color: palette.lightGreen }} /> : bank.tradingFin}
									</TableCell>
									<TableCell align="center">
										{bank.mbd === '1' ? <CheckBoxIcon sx={{ color: palette.lightGreen }} /> : bank.mbd}
									</TableCell>
									<TableCell align="center">
										{bank.fx === '1' ? <CheckBoxIcon sx={{ color: palette.lightGreen }} /> : bank.fx}
									</TableCell>
									<TableCell align="center">
										{bank.creditLine === '1' ? <CheckBoxIcon sx={{ color: palette.lightGreen }} /> : bank.creditLine}
									</TableCell>
									<TableCell align="center">
										{bank.vostro === '1' ? <CheckBoxIcon sx={{ color: palette.lightGreen }} /> : bank.vostro}
									</TableCell>
									<TableCell align="center">
										{bank.otherOperations === '1' ? (
											<CheckBoxIcon sx={{ color: palette.lightGreen }} />
										) : (
											bank.otherOperations
										)}
									</TableCell>
									<TableCell align="center">
										{bank.corrAccounts === '1' ? (
											<CheckBoxIcon sx={{ color: palette.lightGreen }} />
										) : (
											bank.corrAccounts
										)}
									</TableCell>
									<TableCell align="center">
										{bank.genAgreement === '1' ? (
											<CheckBoxIcon sx={{ color: palette.lightGreen }} />
										) : (
											bank.genAgreement
										)}
									</TableCell>
									<TableCell align="center">
										{bank.isda === '1' ? <CheckBoxIcon sx={{ color: palette.lightGreen }} /> : bank.isda}
									</TableCell>
									<TableCell align="center">
										{bank.otherAgreement === '1' ? (
											<CheckBoxIcon sx={{ color: palette.lightGreen }} />
										) : (
											bank.otherAgreement
										)}
									</TableCell>
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
