import React from 'react'
import { Button } from '@mui/material'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import './reloadBtn.css'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions1 from '../../../../hooks/useActions1'

const ReloadBtn = () => {
	const { loading } = useTypedSelector(state => state.dashboard)
	const { getDashBoardLastUpdate, fetchDashboard } = useActions1()
	function handleClick() {
		localStorage.removeItem('dashboard')
		localStorage.removeItem('fcrb')
		localStorage.removeItem('calcfor')
		localStorage.removeItem('plat')
		localStorage.removeItem('creditData')
		getDashBoardLastUpdate()
		fetchDashboard()
	}
	return (
		<Button
			onClick={handleClick}
			sx={{ height: '38px' }}
			size="medium"
			title="Обновить данные страницы"
			disabled={loading}
			variant="outlined"
			color="primary"
		>
			<AutorenewIcon className={`${loading ? 'rotate' : ''}`} />
		</Button>
	)
}

export default ReloadBtn
