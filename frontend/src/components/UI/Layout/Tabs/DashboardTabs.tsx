import React, { Fragment } from 'react'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { v4 as uuid } from 'uuid'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import globalStyles from '../../../../styles/globalStyles'
import useActions from '../../../../hooks/useActions'

function TabPanel(props: any) {
	const { children, value, index, ...other } = props
	return (
		<div role="tabpanel" hidden={value !== index} {...other}>
			{value === index && <Box sx={{ marginTop: '20px', marginX: 0 }}>{children}</Box>}
		</div>
	)
}

interface DashboardTabsProps {
	tabs: { name: string; panel: JSX.Element }[]
}

const DashboardTabs: React.FC<DashboardTabsProps> = function ({ tabs = [] }) {
	const { changeActiveTab } = useActions()
	const { activeTab } = useTypedSelector(state => state.dashboard)
	const handleChange = (event: React.SyntheticEvent, newValue: any) => {
		changeActiveTab(newValue)
	}
	return (
		<Fragment>
			<AppBar position="static" sx={globalStyles.blueBackground}>
				<Tabs onChange={handleChange} value={activeTab} variant="scrollable" scrollButtons="auto">
					{tabs.map(({ name }) => (
						<Tab key={uuid()} label={`${name}`} />
					))}
				</Tabs>
			</AppBar>
			{tabs.map(
				({ panel }, index) =>
					activeTab === index && (
						<TabPanel key={uuid()} value={activeTab} index={index}>
							{panel}
						</TabPanel>
					)
			)}
		</Fragment>
	)
}

export default DashboardTabs
