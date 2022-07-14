import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import MioGm from '../../UI/Layout/Admin/MIO-gm'
import CbnUpdate from '../../UI/Layout/Admin/CBNUpdate'
import VerticalTabs from '../../UI/Layout/Admin/VerticalTabs'
import Users from './Users'
import UpdateLimitOfBanks from '../../UI/Layout/Admin/UpdateLimitOfBanks'

const Settings = () => {
    const {user: {role}} = useSelector(state => state.auth)
    if (role !== 'admin') return <Redirect to='/403'/>
    return (
        <Fragment>
            <>
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
                        }
                    ]
                }/>
            </>
        </Fragment>
    )
}

export default Settings