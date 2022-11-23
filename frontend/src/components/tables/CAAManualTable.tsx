import React, { Fragment, memo, PropsWithChildren } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import { ICorrAccountsAnalyze } from '../../interfaces/caa.interfaces'
import CorrAccountsHead from '../helpers/corrAccountsHead'
import { v4 as uuid } from 'uuid'
import { TableCell, TableRow } from '@mui/material'
import globalStyles from '../../styles/globalStyles'

interface CAAManualTableProps {
	rows: ICorrAccountsAnalyze[]
}

const EditableCell: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<TableCell
			sx={{
				boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
				transition: 'box-shadow 0.3s ease-in-out',
				'&:hover': {
					boxShadow: '0 5px 15px rgba(0, 0, 0, 0.8)'
				}
			}}
			align="center"
		>
			{children}
		</TableCell>
	)
}

const CAAManualTable: React.FC<CAAManualTableProps> = ({ rows }) => {
	return (
		<TableContainer component={Paper}>
			<Table size="small" aria-label="a dense table">
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
									<EditableCell>{bank.countryCode}</EditableCell>
									<EditableCell>{bank.imports}</EditableCell>
									<EditableCell>{bank.exports}</EditableCell>
									<EditableCell>{bank.tradingFin}</EditableCell>
									<EditableCell>{bank.mbd}</EditableCell>
									<EditableCell>{bank.fx}</EditableCell>
									<EditableCell>{bank.creditLine}</EditableCell>
									<EditableCell>{bank.vostro}</EditableCell>
									<EditableCell>{bank.otherOperations}</EditableCell>
									<EditableCell>{bank.corrAccounts}</EditableCell>
									<EditableCell>{bank.genAgreement}</EditableCell>
									<EditableCell>{bank.isda}</EditableCell>
									<EditableCell>{bank.otherAgreement}</EditableCell>
									<TableCell>
										<select name="serviceSize" id="serviceSize">
											<option value={bank.serviceSize as string}></option>
											<option value="big">большой</option>
											<option value="medium">средняя</option>
											<option value="high">высокая</option>
										</select>
									</TableCell>
									<TableCell>{bank.serviceSpeed}</TableCell>
									<TableCell>{bank.serviceQuality}</TableCell>
									<TableCell>{bank.serviceCost}</TableCell>
								</TableRow>
							))}
						</Fragment>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(CAAManualTable)
