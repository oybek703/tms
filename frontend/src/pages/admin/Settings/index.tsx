import React, { Fragment } from 'react'
import VerticalTabs from './vertical-tabs'
import CbnUpdate from './cbn-update'
import MioGm from './mio-gm'
import Users from './users'

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
