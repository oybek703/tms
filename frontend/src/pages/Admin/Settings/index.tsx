import React, { Fragment } from 'react'
import VerticalTabs from './VerticalTabs'
import CbnUpdate from './CBNUpdate'
import MioGm from './MIO-gm'
import Users from './Users'

const Settings = () => {
	return (
		<Fragment>
			<h2>ADMIN DASHBOARD</h2>
			<VerticalTabs
				tabs={[
					{
						tabName: 'Accounts',
						tabData: <Users />
					},
					{
						tabName: 'ФОР',
						tabData: <CbnUpdate />
					},
					{
						tabName: 'GM, UZ AUTO',
						tabData: <MioGm />
					}
				]}
			/>
		</Fragment>
	)
}

export default Settings
