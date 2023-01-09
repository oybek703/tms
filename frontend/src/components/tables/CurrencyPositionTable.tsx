import React, { memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import TableCap from '../helpers/TableCap'
import ExportButton from '../layout/ExportButton'
import BoldWithColor from '../helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import globalStyles from '../../styles/globalStyles'

const CurrencyPositionTable = function () {
	const { currencyPosition } = useTypedSelector(state => state.currencyPosition)
	const { allRows = [], tableSumData = [] } = currencyPosition
	const { reportDate } = useTypedSelector(state => state.operDays)

	// allRows.map((row: any) => {
	// 	console.log(row)
	// })

	return (
		<TableContainer component={Paper}>
			<ExportButton id={`currency-position-${formatOneDate(reportDate)}`} />
			<Table size="small" id={`currency-position-${formatOneDate(reportDate)}`} aria-label="a dense table">
				<TableCap rows={15} text={'в сумм экв.'} />
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell align="center" rowSpan={2}>
							<small>
								<BoldWithColor>№</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center" rowSpan={2}>
							<small>
								<BoldWithColor>Код валюты</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center" rowSpan={2}>
							<small>
								<BoldWithColor>Иностранная валюта</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center" rowSpan={2}>
							<small>
								<BoldWithColor>Требования банка в иностранной валюте, всего (в единицах ин. валюты)</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center" colSpan={2}>
							<small>
								<BoldWithColor>в том числе</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center" rowSpan={2}>
							<small>
								<BoldWithColor>Обязательства банка в иностранной валюте, всего (в единицах ин.валюты)</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center" colSpan={2}>
							<small>
								<BoldWithColor>в том числе</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center" rowSpan={2}>
							<small>
								<BoldWithColor>Сумма сформированного банковского капитала в иностранной валюте</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center" rowSpan={2}>
							<small>
								<BoldWithColor>Открытая валютная позиция (в единицах ин.валюты,+,-)</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center" rowSpan={2}>
							<small>
								<BoldWithColor>Курс иностранной валюты</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center" colSpan={2}>
							<small>
								<BoldWithColor>Открытая валютная позиция в сумовом эквиваленте (сумов)</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center" rowSpan={2}>
							<small>
								<BoldWithColor>Соотношение позиций к регулятивному капиталу банка (в%) (мах-10%)</BoldWithColor>
							</small>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell align="center">
							<small>
								<BoldWithColor>Требования (актив)</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>Требования по непредвиденным обстоятельствам</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>Обязательства (пассив)</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>Обязательства по непредвиденным обстоятельствам</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>длинная</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>короткая</BoldWithColor>
							</small>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell colSpan={3} align="center">
							<small>
								<BoldWithColor>1</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>2=3+4</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>3</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>4</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>5=6+7</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>6</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>7</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>8</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>9=2-5-8</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>10</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>11</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>12</BoldWithColor>
							</small>
						</TableCell>
						<TableCell align="center">
							<small>
								<BoldWithColor>13</BoldWithColor>
							</small>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{allRows.map((row: any, i: number) => (
						<TableRow hover key={`${row.currencyCode}+${i}`}>
							<TableCell align="center">{row.isTableHead ? <b>{i + 1}</b> : i + 1}</TableCell>
							<TableCell align="center">{row.isTableHead ? <b>{row.currencyCode}</b> : row.currencyCode}</TableCell>
							<TableCell sx={globalStyles.noWrap} align="left">
								{row.isTableHead ? <b>{row.currencyName}</b> : row.currencyName}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? <b>{formatNumber(row.rcc, true)}</b> : formatNumber(row.rcc, true)}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? <b>{formatNumber(row.requirements, true)}</b> : formatNumber(row.requirements, true)}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? (
									<b>{formatNumber(row.contingencyClaims, true)}</b>
								) : (
									formatNumber(row.contingencyClaims, true)
								)}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? <b>{formatNumber(row.lcl, true)}</b> : formatNumber(row.lcl, true)}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? <b>{formatNumber(row.liabilities, true)}</b> : formatNumber(row.liabilities, true)}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? (
									<b>{formatNumber(row.contingencyLiabilities, true)}</b>
								) : (
									formatNumber(row.contingencyLiabilities, true)
								)}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? <b>{formatNumber(row.zero8, true)}</b> : formatNumber(row.zero8, true)}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? <b>{formatNumber(row.openCurRate, true)}</b> : formatNumber(row.openCurRate, true)}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? <b>{formatNumber(row.forCurrRate, true)}</b> : formatNumber(row.forCurrRate, true)}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? <b>{formatNumber(row.longVal, true)}</b> : formatNumber(row.longVal, true)}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? <b>{formatNumber(row.shortVal, true)}</b> : formatNumber(row.shortVal, true)}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row.isTableHead ? (
									<b>{row.posRatio ? `${formatNumber(row.posRatio, true)}%` : '-'}</b>
								) : row.posRatio ? (
									`${formatNumber(row.posRatio)}%`
								) : (
									'-'
								)}
							</TableCell>
						</TableRow>
					))}
					{tableSumData.map((val: any, index: number) => (
						<TableRow key={index}>
							{index === 0 && <TableCell colSpan={8} rowSpan={4} />}
							<TableCell align="left" colSpan={4}>
								{val.title}
							</TableCell>
							<TableCell align="center" colSpan={2}>
								{formatNumber(val.sum)}
							</TableCell>
							<TableCell align="center">{val.percent !== 0 && `${formatNumber(val.percent)}%`}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(CurrencyPositionTable)
