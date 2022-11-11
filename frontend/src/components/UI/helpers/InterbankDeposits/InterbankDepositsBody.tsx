import React, { Fragment } from 'react'
import TableCap from '../TableCap'
import { TableRow } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import { formatNumber, formatOneDate, mergeStyles } from '../../../../utils'
import TableBody from '@mui/material/TableBody'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import globalStyles from '../../../../styles/global-styles'
import { ISxStyles } from '../../../../interfaces/styles.interface'

const styles: ISxStyles = {
	redCell: {
		background: 'red',
		color: 'white',
		fontWeight: 'bold'
	},
	redText: {
		color: 'red',
		fontWeight: 'bold'
	}
}

interface InterbankDepositsBodyProps {
	rows: any
	extraCurrency?: string
	isInterbank?: boolean
	cap?: any
}

function formatReportDate(date: Date) {
	function formatToTen(val: Number) {
		return val < 10 ? `0${val}` : val
	}
	const newDate = new Date(date)
	const dateYear = newDate.getFullYear()
	const dateMonth = newDate.getMonth() + 1
	const dateDay = newDate.getDate()
	return `${formatToTen(dateDay)}.${formatToTen(dateMonth)}.${dateYear}`
}

const InterbankDepositsBody: React.FC<InterbankDepositsBodyProps> = ({
	rows = [],
	extraCurrency,
	isInterbank = false,
	cap = <></>
}) => {
	const { reportDate } = useTypedSelector(state => state.operDays)
	const formattedReportDate = formatReportDate(reportDate as any)
	const currencies = ['сум', 'доллар', 'евро']
	if (extraCurrency) currencies.push(extraCurrency)
	return (
		<>
			{currencies.map((t, j) => (
				<Fragment key={j}>
					<TableBody>
						{cap && j === 0 && cap}
						<TableCap textAlign="center" redBack rows={10} text={`${t}`} isHead={false} />
						{((rows[j] || {})['allMappedBanks'] || []).map((b: any, i: number) => (
							<TableRow hover key={i}>
								<TableCell>{i + 1}</TableCell>
								<TableCell align="left" title={b['bankName']}>
									{b['bankName']}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(b['saldoOut'])}
								</TableCell>
								<TableCell align="center">
									{b['beginDate'] === '0' || !b['beginDate']
										? ''
										: isInterbank
										? formatOneDate(b['beginDate'])
										: b['beginDate']}
								</TableCell>
								<TableCell align="center" sx={{ ...(formattedReportDate === b['endDate'] && styles.redText) }}>
									{b['endDate'] === '0' || !b['endDate']
										? ''
										: isInterbank
										? formatOneDate(b['endDate'])
										: b['endDate']}
								</TableCell>
								<TableCell align="center">{formatNumber(b['percentRate'])}%</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(b['forDay'], true)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(b['forPeriod'], true)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(b['dayCount'])}
								</TableCell>
								<TableCell align="center">{b['percentShare']}%</TableCell>
							</TableRow>
						))}
						<TableRow hover>
							<TableCell colSpan={2}>
								<b>{((rows[j] || {}).sumRow || [])[0]}</b>
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								<b>{formatNumber(((rows[j] || {}).sumRow || [])[1])}</b>
							</TableCell>
							<TableCell colSpan={2} sx={styles.redCell}>
								Средневзвешенные % ставка
							</TableCell>
							<TableCell sx={mergeStyles(globalStyles.noWrap, styles.redCell)} align="center">
								<b>{formatNumber(((rows[j] || {}).sumRow || [])[2])}%</b>
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								<b>{formatNumber(((rows[j] || {}).sumRow || [])[3])}</b>
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								<b>{formatNumber(((rows[j] || {}).sumRow || [])[4])}</b>
							</TableCell>
							<TableCell />
							<TableCell align="center">
								<b>{((rows[j] || {}).sumRow || [])[5]}</b>
							</TableCell>
						</TableRow>
					</TableBody>
				</Fragment>
			))}
		</>
	)
}

export default InterbankDepositsBody
