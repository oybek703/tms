import globalStyles from '../../styles/globalStyles'
import TableRow from '@mui/material/TableRow'
import { TableCell } from '@mui/material'
import BoldWithColor from './BoldWithColor'
import TableHead from '@mui/material/TableHead'
import React from 'react'

const CorrAccountsHead = () => {
	return (
		<TableHead sx={globalStyles.stickyTableHead}>
			<TableRow>
				<TableCell colSpan={3} align="center">
					<BoldWithColor>Наим.банка и страна</BoldWithColor>
				</TableCell>
				<TableCell colSpan={8} align="center">
					<BoldWithColor>Виды операций</BoldWithColor>
				</TableCell>
				<TableCell colSpan={4} align="center">
					<BoldWithColor>Нал.соглашения</BoldWithColor>
				</TableCell>
				<TableCell colSpan={4} align="center">
					<BoldWithColor>Качество обслуживание</BoldWithColor>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					<BoldWithColor>№</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Наименование</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Страна</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Импорт оплаты</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Экс. поступ.</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Торг. фин</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>МБД</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>FX</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Кредитная линия</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Востро</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Причие</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Корр. счет</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Ген. соглашения</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>ISDA</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Прочие</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Обьем операции</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Скорость обслуживание</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Качество обслуживание</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Стоимость услуг(тарифы)</BoldWithColor>
				</TableCell>
			</TableRow>
		</TableHead>
	)
}

export default CorrAccountsHead
