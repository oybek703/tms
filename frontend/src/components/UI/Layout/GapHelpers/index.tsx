import React, { Fragment } from 'react'
import { v4 as uuid } from 'uuid'
import TableCell from '@mui/material/TableCell'
import { formatNumber } from '../../../../utils'
import TableRow from '@mui/material/TableRow'
import makeStyles from '@mui/styles/makeStyles'
import TableHead from '@mui/material/TableHead'
import WhiteCell from '../../helpers/FormattedCell/WhiteCell'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import BoldWithColor from '../../helpers/BoldWithColor'
import theme from '../../theme'

const useStyles = makeStyles({
	noWrap: theme.mixins.noWrap,
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
	},
	stickyCol: theme.mixins.stickyCol,
	blueBackground: theme.mixins.blueBackground,
	stickTableHead: theme.mixins.stickyTableHead,
	redRow: {
		fontWeight: 600,
		color: 'rgb(255, 51, 0)'
	},
	bordered: theme.mixins.dottedBorder
})

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
	const classes = useStyles()
	return (
		<Fragment>
			{months.map((_, monthIndex) => (
				<Fragment key={uuid()}>
					{['TOTAL', 'NATIONAL_CURRENCY', 'FOREIGN_CURRENCY', 'USD', 'EUR'].map((propName, index) => (
						<Fragment key={uuid()}>
							<TableCell
								className={`${classes.noWrap} ${total && classes.darkBackground} 
                        ${blueBackground ? classes.blueBackground : ''} 
                        ${(row[monthIndex] || {})['editable'] && classes.bordered}`}
								style={{
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
	const classes = useStyles()
	return (
		<TableRow key={uuid()}>
			<TableCell
				align={align}
				className={`${classes.noWrap} ${classes.darkBackground} ${blueBackground ? classes.blueBackground : ''}`}
				colSpan={2}
			>
				{(total[0] || {})['INDICATOR_NAME']}
			</TableCell>
			<RenderByMonth blueBackground={blueBackground} withPercent={withPercent} total months={months} row={total} />
		</TableRow>
	)
}

const VerticalColumn: React.FC<{ data: []; text: string }> = function ({ data = [], text = 'приток' }) {
	const classes = useStyles()
	return (
		<TableRow hover>
			<TableCell align="center" style={{ borderRight: '2px solid #7794aa' }} rowSpan={data.length + 1}>
				<div className={classes.verticalText}>{text}</div>
			</TableCell>
		</TableRow>
	)
}

const InnerDataRows: React.FC<{ data: any; months: string[] }> = function ({ data = [], months }) {
	const classes = useStyles()
	if (data.length === 0) return <tr />
	return (
		<>
			{data.map((row: any) => (
				<TableRow hover key={uuid()}>
					<TableCell align="left" className={classes.noWrap}>
						{(row[0] || {})['INDICATOR_NAME']}
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
	const classes = useStyles()
	return (
		<TableHead className={classes.stickTableHead}>
			<TableRow>
				<WhiteCell rowSpan={2} />
				<WhiteCell align="center" rowSpan={2}>
					<b>Наименование</b>
				</WhiteCell>
				{months.map(month => (
					<WhiteCell
						key={uuid()}
						colSpan={5}
						style={{
							borderRight: '1px solid #ddd',
							borderLeft: '1px solid #ddd'
						}}
						align="center"
					>
						<b>{month}</b>
					</WhiteCell>
				))}
			</TableRow>
			<TableRow>
				{months.map(_ => (
					<Fragment key={uuid()}>
						{['Итого (UZS екв.)', 'Нац.вал. (UZS)', 'Ин.вал. (USD екв.)', 'USD', 'EUR'].map((propName, index) => (
							<WhiteCell
								key={uuid()}
								style={{
									borderRight: index === 4 ? '1px solid #ddd' : '1px solid #eee',
									borderLeft: index === 0 ? '1px solid #ddd' : '1px solid #eee'
								}}
								align="center"
							>
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
	const classes = useStyles()
	return (
		<TableRow hover>
			<TableCell className={classes.redRow}>{row['INDICATOR_NAME']}</TableCell>
			<TableCell align="center" className={`${classes.redRow} ${classes.noWrap}`}>
				{formatNumber(row['TOTAL'])}%
			</TableCell>
			<TableCell align="center" className={`${classes.redRow} ${classes.noWrap}`}>
				{formatNumber(row['NATIONAL_CURRENCY'])}%
			</TableCell>
			<TableCell align="center" className={`${classes.redRow} ${classes.noWrap}`}>
				{formatNumber(row['FOREIGN_CURRENCY'])}%
			</TableCell>
		</TableRow>
	)
}

function LcrAndNsfrTable({ data = [], month = '' }) {
	const classes = useStyles()
	return (
		<TableContainer component={Paper}>
			<Table size="small">
				<TableHead className={classes.stickTableHead}>
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
						<TableCell align="center" className={classes.noWrap}>
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
								<TableCell>{row['INDICATOR_NAME']}</TableCell>
								<TableCell align="center" className={classes.noWrap}>
									{formatNumber(row['TOTAL'])}
								</TableCell>
								<TableCell align="center" className={classes.noWrap}>
									{formatNumber(row['NATIONAL_CURRENCY'])}
								</TableCell>
								<TableCell align="center" className={classes.noWrap}>
									{formatNumber(row['FOREIGN_CURRENCY'])}
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
