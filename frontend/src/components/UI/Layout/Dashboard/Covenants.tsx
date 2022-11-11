import React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import { TableBody, TableContainer, TableRow } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import { v4 as uuid } from 'uuid'
import { covenantData, Status } from '../../../../tempData'
import BoldWithColor from '../../helpers/BoldWithColor'
import globalStyles from '../../../../styles/global-styles'

function getColorByStatus(status: Status) {
	if (status === Status.safe) return '#00B050'
	if (status === Status.warn) return '#f38003'
	if (status === Status.danger) return '#ff6363'
	return '#fff'
}

const Covenants = () => {
	return (
		<TableContainer component={Paper}>
			<Table size="small">
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell align="center" rowSpan={2}>
							<BoldWithColor>№</BoldWithColor>
						</TableCell>
						<TableCell align="center" rowSpan={2}>
							<BoldWithColor>Наименование ковенанти</BoldWithColor>
						</TableCell>
						<TableCell align="center" rowSpan={2}>
							<BoldWithColor>AO Асакабанк</BoldWithColor>
						</TableCell>
						<TableCell align="center" colSpan={9}>
							<BoldWithColor>Контрагент</BoldWithColor>
						</TableCell>
					</TableRow>
					<TableRow>
						{[
							'China Development Bank',
							'Landesbank Baden-Wuerttemberg',
							'АБР',
							'JPMorgan Chase Bank',
							'Turkiye Ihracat Kredi Bankasi A.S.',
							'Europe Asia Investment Finance B.V.',
							'Европейский Банк Реконструкции и Развития',
							'Deutsche Bank AG'
						].map(bank => (
							<TableCell sx={globalStyles.blueBackground} key={uuid()} align="center">
								<BoldWithColor>{bank}</BoldWithColor>
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{covenantData.map((b, index) => (
						<TableRow hover key={uuid()}>
							<TableCell align="center">
								<b>{index + 1}</b>
							</TableCell>
							<TableCell>
								<b>{b.title}</b>
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{b.main_bank} {typeof b.main_bank === 'number' && '%'}
							</TableCell>
							{Array(8)
								.fill('')
								.map((_, idx) => (
									<TableCell
										key={uuid()}
										sx={globalStyles.noWrap}
										align="center"
										style={{
											// @ts-ignore
											backgroundColor: !b[`bank_${idx + 1}`].value
												? 'inherit'
												: // @ts-ignore
												  getColorByStatus(b[`bank_${idx + 1}`].status),
											color: '#fff'
										}}
									>
										<b>
											{/*  @ts-ignore */}
											<i>{b[`bank_${idx + 1}`].value}</i>
										</b>
									</TableCell>
								))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default Covenants
