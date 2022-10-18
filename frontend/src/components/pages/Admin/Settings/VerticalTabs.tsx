import React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { v4 as uuid } from 'uuid'
import { useLocation } from 'react-router-dom'
import { Grid, Paper } from '@mui/material'
import theme from '../../../UI/theme'

function TabPanel(props: any) {
	const { children, value, index, ...other } = props
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<div>
					<div>{children}</div>
				</div>
			)}
		</div>
	)
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
}

function a11yProps(index: number) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`
	}
}

interface VerticalTabsProps {
	tabs: {
		tabName: string
		tabData: JSX.Element | undefined
	}[]
}

const VerticalTabs: React.FC<VerticalTabsProps> = function ({ tabs = [] }) {
	const { hash } = useLocation()
	const [value, setValue] = React.useState(hash ? +hash[1] : 0)
	const tabNames = tabs.map(tab => tab['tabName'])
	const tabDatas = tabs.map(tab => tab['tabData'])
	const handleChange = (event: React.SyntheticEvent, newValue: any) => {
		setValue(newValue)
	}

	return (
		<Grid sx={{ display: 'grid', gridTemplateColumns: 'minmax(300px, auto) 1fr', gap: '20px' }}>
			<Tabs component={Paper} onChange={handleChange} orientation="vertical" variant="scrollable" value={value}>
				{tabNames.map((tabName, index) => (
					<Tab
						sx={{
							'&.MuiTab-root': {
								textAlign: 'left',
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
								width: '100%',
								color: '#000'
							},
							'&.Mui-selected': {
								backgroundColor: theme.palette.info.light,
								color: '#fff'
							}
						}}
						key={uuid()}
						href={`#${index}`}
						component="a"
						label={tabName}
						{...a11yProps(index)}
					/>
				))}
			</Tabs>
			{tabDatas.map((tabData, index) => (
				<TabPanel key={uuid()} value={value} index={index}>
					{tabData}
				</TabPanel>
			))}
		</Grid>
	)
}

export default VerticalTabs
