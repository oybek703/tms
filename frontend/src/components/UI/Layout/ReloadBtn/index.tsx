import React from 'react'
import { Button } from '@mui/material'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import './reloadBtn.css'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'

const ReloadBtn = () => {
	const { loading } = useTypedSelector(state => state.dashboard)
	const { getDashBoardLastUpdate, fetchDashboard } = useActions()
	function handleClick() {
		localStorage.removeItem('dashboard')
		localStorage.removeItem('fcrb')
		localStorage.removeItem('calcFor')
		localStorage.removeItem('placedAttracted')
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
