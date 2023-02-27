import React, { Fragment, memo } from 'react'
import { TableContainer, Table, TableCell, TableRow, TableBody, TableHead } from '@mui/material'
import BoldWithColor from '../helpers/BoldWithColor'
import globalStyles from '../../styles/globalStyles'
import { v4 as uuid } from 'uuid'
import useTypedSelector from '../../hooks/useTypedSelector'
import { formatNumber } from '../../utils'
import palette from '../../styles/palette'

const colNames = [
	'Конвертации с ин. банком',
	'Конвертации для юридических лиц. (импорт)',
	'Конвертации для юридических лиц. (обязательство)',
	'Меж филиал спот',
	'Банкомат',
	'Обменный пункт',
	'Asaka Mobile',
	'Резервы по кредитам/лизингам',
	'Начисленные проценты по кредитам/лизингам юр.лиц/ИП'
]

const totalLabel = 'Итого'

const FilialCpTable = () => {
	const { filialCp } = useTypedSelector(state => state.filialCp)
	return (
		<TableContainer sx={{ maxHeight: '69vh', pb: 0 }}>
			<Table size="small">
				<TableHead sx={{ ...globalStyles.stickyHead, backgroundColor: palette.primary }}>
					<TableRow>
						<TableCell
							sx={{ position: 'sticky', left: 0, zIndex: 99999, backgroundColor: palette.primary }}
							rowSpan={2}
							align="center"
						>
							<BoldWithColor>Филиалы</BoldWithColor>
						</TableCell>
						{colNames.map(title => (
							<TableCell key={uuid()} colSpan={2} align="center">
								<BoldWithColor>{title}</BoldWithColor>
							</TableCell>
						))}
					</TableRow>
					<TableRow>
						{colNames.map(() => (
							<Fragment key={uuid()}>
								<TableCell align="center">
									<BoldWithColor>Продажа</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>Покупка</BoldWithColor>
								</TableCell>
							</Fragment>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{filialCp.map(row => (
						<TableRow key={uuid()}>
							<TableCell
								align="center"
								sx={{
									position: 'sticky',
									left: 0,
									backgroundColor: palette.primary,
									...globalStyles.noWrap
								}}
							>
								<BoldWithColor>{row.filialName}</BoldWithColor>
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.purchase1)}</b> : formatNumber(row.purchase1)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.sale1)}</b> : formatNumber(row.sale1)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.purchase2)}</b> : formatNumber(row.purchase2)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.sale2)}</b> : formatNumber(row.sale2)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.purchase3)}</b> : formatNumber(row.purchase3)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.sale3)}</b> : formatNumber(row.sale3)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.purchase4)}</b> : formatNumber(row.purchase4)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.sale4)}</b> : formatNumber(row.sale4)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.purchase5)}</b> : formatNumber(row.purchase5)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.sale5)}</b> : formatNumber(row.sale5)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.purchase6)}</b> : formatNumber(row.purchase6)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.sale6)}</b> : formatNumber(row.sale6)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.purchase7)}</b> : formatNumber(row.purchase7)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.sale7)}</b> : formatNumber(row.sale7)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.purchase8)}</b> : formatNumber(row.purchase8)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.sale8)}</b> : formatNumber(row.sale8)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.purchase9)}</b> : formatNumber(row.purchase9)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{row.filialName === totalLabel ? <b>{formatNumber(row.sale9)}</b> : formatNumber(row.sale9)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(FilialCpTable)
