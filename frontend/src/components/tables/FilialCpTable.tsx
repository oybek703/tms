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
	'Конвертации для юр.клиентов за нац. Вал.',
	'Конвертации для юр.лиц за нац. Вал.(обязательство)',
	'Меж филиал спот',
	'Банкомат',
	'ОП',
	'Asaka Mobile',
	'Резервы по кредитам/лизингам',
	'Начисленные проценты по кредитам/лизингам юр.лиц/ИП'
]

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
									<BoldWithColor>Покупка</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>Продажа</BoldWithColor>
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
								{formatNumber(row.purchase1)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.sale1)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.purchase2)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.sale2)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.purchase3)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.sale3)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.purchase4)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.sale4)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.purchase5)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.sale5)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.purchase6)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.sale6)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.purchase7)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.sale7)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.purchase8)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.sale8)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.purchase9)}
							</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(row.sale9)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(FilialCpTable)
