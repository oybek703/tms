import React from 'react'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import { v4 as uuid } from 'uuid'
import { Grid } from '@mui/material'
import globalStyles from '../../../styles/globalStyles'

interface TopDepositsTabProps {
	active: number
	handleChange: (index: number) => void
}

const TopDepositsTab: React.FC<TopDepositsTabProps> = ({ active = 1, handleChange }) => {
	const titles = [
		{ title: 'ДЕПОЗИТЫ ДО ВОСТРЕБОВАНИЯ', code: '20200' },
		{ title: 'СРОЧНЫЕ ДЕПОЗИТЫ', code: '20600' },
		{ title: 'СБЕРЕГАТЕЛЬНЫЕ ДЕПОЗИТЫ', code: '20400' },
		{ title: 'ДЕПОЗИТЫ КЛИЕНТОВ ПО АККРЕДИТИВАМ', code: '22602' },
		{
			title: 'ЗАРЕЗЕРВИРОВАННЫЕ СРЕДСТВА КЛИЕНТОВ ДЛЯ КОНВЕРТАЦИИ',
			code: '22613'
		},
		{ title: 'СРЕДСТВА КЛИЕНТОВ, СКОНВЕРТИРОВАННЫЕ', code: '22614' }
	]
	return (
		<Grid sx={globalStyles.marginBottom10}>
			<ButtonGroup size="small" color="primary">
				{titles.map(({ title, code }, i) => (
					<Button
						sx={{
							...globalStyles.tabBtn,
							textTransform: 'lowercase'
						}}
						title={`${title} - ${code}`}
						onClick={handleChange.bind(null, i + 1)}
						size="small"
						key={uuid()}
						variant={`${active === i + 1 ? 'contained' : 'outlined'}`}
					>
						{title}
					</Button>
				))}
			</ButtonGroup>
		</Grid>
	)
}

export default TopDepositsTab
