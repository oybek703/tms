import React, { Fragment } from 'react'
import VerticalTabs from './VerticalTabs'
import CbnUpdate from './CbnUpdate'
import MioGm from './MIOGm'
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
						tabName: 'gm, UZ AUTO',
						tabData: <MioGm />
					}
				]}
			/>
		</Fragment>
	)
}

export default Settings
