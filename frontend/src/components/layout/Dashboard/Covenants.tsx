import React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import { TableBody, TableContainer, TableRow } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import { v4 as uuid } from 'uuid'
import { covenantData, Status } from '../../../tempData'
import BoldWithColor from '../../helpers/BoldWithColor'
import globalStyles from '../../../styles/globalStyles'

function getColorByStatus(status: Status) {
	if (status === Status.safe) return '#00B050'
	if (status === Status.warn) return '#f38003'
	if (status === Status.danger) return '#ff6363'
	return '#fff'
}

const bankNames = [
	'China Development Bank',
	'Landesbank Baden-Wuerttemberg',
	'АБР',
	'JPMorgan Chase Bank',
	'Turkiye Ihracat Kredi Bankasi A.S.',
	'Europe Asia Investment Finance B.V.',
	'Европейский Банк Реконструкции и Развития',
	'Deutsche Bank AG',
	'Cargill',
	'Credit Suisse AG'
]

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
						<TableCell align="center" colSpan={bankNames.length}>
							<BoldWithColor>Контрагент</BoldWithColor>
						</TableCell>
					</TableRow>
					<TableRow>
						{bankNames.map(bank => (
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
							{Array(bankNames.length)
								.fill('')
								.map((_, idx) => {
									// @ts-ignore
									const oneBankData = b[`bank_${idx + 1}`]
									if (!oneBankData) return null
									return (
										<TableCell
											key={uuid()}
											sx={globalStyles.noWrap}
											align="center"
											style={{
												backgroundColor: !oneBankData.value ? 'inherit' : getColorByStatus(oneBankData.status),
												color: '#fff'
											}}
										>
											<b>
												<i>{oneBankData.value}</i>
											</b>
										</TableCell>
									)
								})}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default Covenants
