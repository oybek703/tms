import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import Grid from '@mui/material/Grid'
import GMLiabilities from '../charts/gm/GMLiabilities'
import GMClassification from '../charts/gm/GMClassification'
import ExportButton from '../layout/ExportButton'
import BoldWithColor from '../helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import globalStyles from '../../styles/globalStyles'

function sumByCode(array = [], code = '') {
	let usd = 0
	let eur = 0
	let rub = 0
	let uzs = 0
	array.forEach(v => {
		if (v['checkAccount'] === code && v['codeCurrency'] === '840') {
			usd += v['parValue']
		}
		if (v['checkAccount'] === code && v['codeCurrency'] === '978') {
			eur += v['parValue']
		}
		if (v['checkAccount'] === code && v['codeCurrency'] === '643') {
			rub += v['parValue']
		}
		if (v['checkAccount'] === code && v['codeCurrency'] === '000') {
			uzs += v['parValue']
		}
	})
	return [usd, eur, rub, uzs].map(n => +(n / Math.pow(10, 6)).toFixed(1))
}

const GMTable: React.FC<{ rows: any }> = function ({ rows = {} }) {
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { tableData = [], accredetiv = { acs: [], others: [] }, currRates = [] } = rows
	let uzsSum = 0
	let usdSum = 0
	let eurSum = 0
	let rubSum = 0
	tableData.forEach((r: any) => {
		const codeCurrency = r['codeCurrency']
		const parValue = r['parValue']
		switch (codeCurrency) {
			case '000':
				if (r['checkAccount']) {
					return (uzsSum += parValue)
				}
				return uzsSum
			case '840':
				return (usdSum += parValue)
			case '643':
				return (rubSum += parValue)
			case '978':
				return (eurSum += parValue)
			default:
				return 0
		}
	})
	const sums = [uzsSum, usdSum, eurSum, rubSum]
	const accountCodes = ['20214', '20414', '20614', '22602', '22613', '22614', '22624']
	const sumByCodes = {
		...accountCodes.reduce((acc: any, val: any) => {
			acc[val] = sumByCode(tableData, val)
			return acc
		}, {})
	}
	let classificationSumRow = [0, 0, 0, 0]
	for (const code in sumByCodes) {
		if (sumByCodes.hasOwnProperty(code)) {
			classificationSumRow[0] += sumByCodes[code][0]
			classificationSumRow[1] += sumByCodes[code][1]
			classificationSumRow[2] += sumByCodes[code][2]
			classificationSumRow[3] += sumByCodes[code][3]
		}
	}
	classificationSumRow = classificationSumRow.map(v => +v.toFixed(1))
	const classificationLastRow = classificationSumRow
		.map((r, i) => {
			if (currRates[i]) {
				return r * currRates[i]
			}
			return r
		})
		.map(v => +v.toFixed(1))
	const gmLiabilities = [
		...(accredetiv.acs || []).map(Number),
		...(accredetiv.others || []).map((v: any) => +v['parValue'])
	].map(v => Math.round(Math.abs(v)))
	return (
		<Fragment>
			<Grid container spacing={2} justifyContent="space-between">
				<Grid item xs={6}>
					<Fragment>
						<Table size="small">
							<TableHead sx={globalStyles.stickyTableHead}>
								<TableRow>
									<TableCell align="center">
										<BoldWithColor>Обязательства АО &quot;UzAuto Motors&quot; перед банком</BoldWithColor>
									</TableCell>
								</TableRow>
							</TableHead>
						</Table>
						<br />
						<TableContainer component={Paper} sx={globalStyles.paddingBottom0}>
							<Table size="small">
								<TableHead sx={globalStyles.stickyTableHead}>
									<TableRow>
										<TableCell align="center">
											<BoldWithColor>Задолженность</BoldWithColor>
										</TableCell>
										<TableCell align="center">
											<BoldWithColor>Тип валют</BoldWithColor>
										</TableCell>
										<TableCell align="center">
											<BoldWithColor>Сумма (в номинале)</BoldWithColor>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell rowSpan={4}>Аккредетив</TableCell>
									</TableRow>
									{['USD', 'EUR', 'RUB'].map((c, i) => (
										<TableRow hover key={i}>
											<TableCell align="center">{c}</TableCell>
											<TableCell align="center">{formatNumber(Math.abs((accredetiv['acs'] || [])[i]), true)}</TableCell>
										</TableRow>
									))}
									{(accredetiv['others'] || []).map((v: any, i: number) => (
										<TableRow key={i} sx={{ ...(i === 0 && { backgroundColor: '#b4c6cf' }) }}>
											{i === 0 ? (
												<Fragment>
													<TableCell>
														<b>{v['indicatorName']}</b>
													</TableCell>
													<TableCell align="center">
														<b>{v['codeCurrency']}</b>
													</TableCell>
													<TableCell align="center">
														<b>{formatNumber(v['parValue'], true)}</b>
													</TableCell>
												</Fragment>
											) : (
												<Fragment>
													<TableCell>{v['indicatorName']}</TableCell>
													<TableCell align="center">{v['codeCurrency']}</TableCell>
													<TableCell align="center">{formatNumber(v['parValue'], true)}</TableCell>
												</Fragment>
											)}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Fragment>
				</Grid>
				<Grid item container alignItems="center" justifyContent="center" xs={6}>
					<GMLiabilities series={gmLiabilities} />
				</Grid>
				<Grid item xs={7}>
					<TableContainer component={Paper} sx={globalStyles.paddingBottom0}>
						<Table size="small">
							<TableHead sx={globalStyles.stickyTableHead}>
								<TableRow>
									<TableCell />
									<TableCell align="center">
										<BoldWithColor>USD</BoldWithColor>
									</TableCell>
									<TableCell align="center">
										<BoldWithColor>EUR</BoldWithColor>
									</TableCell>
									<TableCell align="center">
										<BoldWithColor>RUB</BoldWithColor>
									</TableCell>
									<TableCell align="center">
										<BoldWithColor>UZS</BoldWithColor>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{['20214', '20414', '20614', '22602', '22613', '22614', '22624'].map((c, i) => (
									<TableRow hover key={i}>
										<TableCell align="center">{c}</TableCell>
										{sumByCodes[c].map((v: any, j: number) => (
											<TableCell align="center" key={j}>
												{formatNumber(v)}
											</TableCell>
										))}
									</TableRow>
								))}
								<TableRow hover>
									<TableCell align="center">
										<b>Итого</b>
									</TableCell>
									{classificationSumRow.map((v, i) => (
										<TableCell align="center" key={i}>
											<b>{formatNumber(v)}</b>
										</TableCell>
									))}
								</TableRow>
								<TableRow hover>
									<TableCell align="center">
										<b>эквива.сум</b>
									</TableCell>
									{classificationLastRow.map((v, i) => (
										<TableCell align="center" key={i}>
											<b>{formatNumber(v)}</b>
										</TableCell>
									))}
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
				<Grid item container alignItems="center" justifyContent="center" xs={5}>
					<GMClassification series={classificationLastRow} data={classificationSumRow} />
				</Grid>
			</Grid>
			<br />
			<TableContainer component={Paper}>
				<ExportButton id={`uzAuto-GM-${formatOneDate(reportDate)}`} />
				<Table size="small" id={`uzAuto-GM-${formatOneDate(reportDate)}`} aria-label="a dense table">
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell align="center">
								<BoldWithColor>Расчетный счет</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Вид операции</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Сумма (в номинале)</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Тып валют</BoldWithColor>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{tableData.map((row: any, i: number) => (
							<TableRow hover key={i}>
								<TableCell align="center">{row.checkAccount}</TableCell>
								<TableCell align="left">{row.operationType}</TableCell>
								<TableCell align="center">{formatNumber(row.parValue)}</TableCell>
								<TableCell align="center">
									{row.codeCurrency === '000'
										? 'UZS'
										: row.codeCurrency === '840'
										? 'USD'
										: row.codeCurrency === '978'
										? 'EUR'
										: row.codeCurrency === '643'
										? 'RUB'
										: ''}
								</TableCell>
							</TableRow>
						))}
						{[
							{ title: 'ВСЕГО сум', currency: 'UZS' },
							{ title: 'ВСЕГО доллар', currency: 'USD' },
							{ title: 'ВСЕГО евро', currency: 'EUR' },
							{ title: 'ВСЕГО рубль', currency: 'RUB' }
						].map((v, i) => (
							<TableRow hover key={i}>
								<TableCell>{''}</TableCell>
								<TableCell>
									<b>{v.title}</b>
								</TableCell>
								<TableCell align="center">
									<b>{formatNumber(sums[i], 'e')}</b>
								</TableCell>
								<TableCell align="center">{v.currency}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Fragment>
	)
}

export default memo(GMTable)
