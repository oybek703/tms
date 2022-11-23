import React, { Fragment } from 'react'
import { v4 as uuid } from 'uuid'
import TableCell from '@mui/material/TableCell'
import { formatNumber, mergeStyles } from '../../../utils'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import WhiteCell from '../../helpers/formattedCell/WhiteCell'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import BoldWithColor from '../../helpers/BoldWithColor'
import globalStyles from '../../../styles/globalStyles'
import { Grid } from '@mui/material'
import { ISxStyles } from '../../../interfaces/styles.interface'

const styles: ISxStyles = {
	verticalText: {
		writingMode: 'vertical-rl',
		transform: 'rotate(180deg)',
		fontWeight: 'bold',
		textTransform: 'uppercase',
		fontSize: '1.8em'
	},
	darkBackground: {
		backgroundColor: '#eeeeee',
		fontWeight: 'bold'
	}
}

interface RenderByMonthProps {
	months: string[]
	row: any
	total?: boolean
	blueBackground?: boolean
	withPercent?: boolean
}

const RenderByMonth: React.FC<RenderByMonthProps> = function ({
	months = [],
	row = {},
	total = false,
	blueBackground = false,
	withPercent = false
}) {
	return (
		<Fragment>
			{months.map((_, monthIndex) => (
				<Fragment key={uuid()}>
					{['total', 'nationalCurrency', 'foreignCurrency', 'usd', 'eur'].map((propName, index) => (
						<Fragment key={uuid()}>
							<TableCell
								sx={{
									...globalStyles.noWrap,
									...(total && styles.darkBackground),
									...(blueBackground && globalStyles.blueBackground),
									...((row[monthIndex] || {})['editable'] && globalStyles.dottedBorder),
									borderRight:
										index === 4
											? total
												? !blueBackground
													? '1px solid #7794aa'
													: '1px solid #eee'
												: '1px solid #7794aa'
											: '1px solid #eee',
									borderLeft:
										index === 0
											? total
												? !blueBackground
													? '1px solid #7794aa'
													: '1px solid #eee'
												: '1px solid #7794aa'
											: '1px solid #eee'
								}}
								align="center"
							>
								{formatNumber((row[monthIndex] || {} || {})[propName], true)}
								{withPercent && '%'}
							</TableCell>
						</Fragment>
					))}
				</Fragment>
			))}
		</Fragment>
	)
}

interface TotalOrBoldRowProps {
	months: string[]
	total: any
	align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
	blueBackground: boolean
	withPercent?: boolean
}

const TotalOrBoldRow: React.FC<TotalOrBoldRowProps> = function ({
	months,
	total,
	align = 'center',
	blueBackground = false,
	withPercent = false
}) {
	return (
		<TableRow key={uuid()}>
			<TableCell
				align={align}
				sx={mergeStyles(globalStyles.noWrap, styles.darkBackground, {
					...(blueBackground && globalStyles.blueBackground)
				})}
				colSpan={2}
			>
				{(total[0] || {})['indicatorName']}
			</TableCell>
			<RenderByMonth blueBackground={blueBackground} withPercent={withPercent} total months={months} row={total} />
		</TableRow>
	)
}

const VerticalColumn: React.FC<{ data: []; text: string }> = function ({ data = [], text = 'приток' }) {
	return (
		<TableRow hover>
			<TableCell align="center" sx={{ borderRight: '2px solid #7794aa' }} rowSpan={data.length + 1}>
				<Grid sx={styles.verticalText}>{text}</Grid>
			</TableCell>
		</TableRow>
	)
}

const InnerDataRows: React.FC<{ data: any; months: string[] }> = function ({ data = [], months }) {
	if (data.length === 0) return <tr />
	return (
		<>
			{data.map((row: any) => (
				<TableRow hover key={uuid()}>
					<TableCell align="left" sx={globalStyles.noWrap}>
						{(row[0] || {})['indicatorName']}
					</TableCell>
					<RenderByMonth row={row} months={months} />
				</TableRow>
			))}
		</>
	)
}

interface GapTableHeadProps {
	months: string[]
}

const GapTableHead: React.FC<GapTableHeadProps> = function ({ months = [] }) {
	return (
		<TableHead sx={globalStyles.stickyTableHead}>
			<TableRow>
				<WhiteCell rowSpan={2} />
				<WhiteCell align="center" rowSpan={2}>
					<b>Наименование</b>
				</WhiteCell>
				{months.map(month => (
					<WhiteCell key={uuid()} colSpan={5} align="center">
						<b>{month}</b>
					</WhiteCell>
				))}
			</TableRow>
			<TableRow>
				{months.map(_ => (
					<Fragment key={uuid()}>
						{['Итого (UZS екв.)', 'Нац.вал. (UZS)', 'Ин.вал. (USD екв.)', 'USD', 'EUR'].map((propName, index) => (
							<WhiteCell key={uuid()} align="center">
								<b>{propName}</b>
							</WhiteCell>
						))}
					</Fragment>
				))}
			</TableRow>
		</TableHead>
	)
}

const RedRow: React.FC<{ row: any }> = function ({ row = {} }) {
	return (
		<TableRow hover>
			<TableCell
				sx={{
					fontWeight: 600,
					color: 'rgb(255, 51, 0)'
				}}
			>
				{row['indicatorName']}
			</TableCell>
			<TableCell align="center" sx={{ ...globalStyles.noWrap, fontWeight: 600, color: 'rgb(255, 51, 0)' }}>
				{formatNumber(row['total'])}%
			</TableCell>
			<TableCell align="center" sx={{ ...globalStyles.noWrap, fontWeight: 600, color: 'rgb(255, 51, 0)' }}>
				{formatNumber(row['nationalCurrency'])}%
			</TableCell>
			<TableCell align="center" sx={{ ...globalStyles.noWrap, fontWeight: 600, color: 'rgb(255, 51, 0)' }}>
				{formatNumber(row['foreignCurrency'])}%
			</TableCell>
		</TableRow>
	)
}

function LcrAndNsfrTable({ data = [], month = '' }) {
	return (
		<TableContainer component={Paper}>
			<Table size="small">
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell>
							<BoldWithColor>{month}</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Итого</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Нац. вал.</BoldWithColor>
						</TableCell>
						<TableCell align="center" sx={globalStyles.noWrap}>
							<BoldWithColor>Ин. вал.</BoldWithColor>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((row, index) =>
						index === 0 ? (
							<RedRow key={uuid()} row={row} />
						) : (
							<TableRow hover key={uuid()}>
								<TableCell>{row['indicatorName']}</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(row['total'])}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(row['nationalCurrency'])}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(row['foreignCurrency'])}
								</TableCell>
							</TableRow>
						)
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export { TotalOrBoldRow, VerticalColumn, InnerDataRows, RenderByMonth, GapTableHead, LcrAndNsfrTable }
