import React, { Fragment } from 'react'
import VerticalTabs from './VerticalTabs'
import CbnUpdate from './CBNUpdate'
import MioGm from './MIO-gm'
import UpdateLimitOfBanks from './UpdateLimitOfBanks'
import Users from './Users'
import Banks from './Banks'


const Settings = () => {
  return (
    <Fragment>
      <h2>ADMIN DASHBOARD</h2>
      <VerticalTabs tabs={
        [
          {
            tabName: 'ФОР',
            tabData: <CbnUpdate/>
          },
          {
            tabName: 'GM, UZ AUTO',
            tabData: <MioGm/>
          },
          {
            tabName: 'Correspondent',
            tabData: <UpdateLimitOfBanks/>
          },
          {
            tabName: 'Accounts',
            tabData: <Users/>
          },
          {
            tabName: 'Banks',
            tabData: <Banks/>
          }
        ]
      }/>
    </Fragment>
  )
}

export default Settings
