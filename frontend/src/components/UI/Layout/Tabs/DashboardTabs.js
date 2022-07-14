import React, { Fragment } from 'react'
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import {v4 as uuid} from 'uuid'
import {useDispatch, useSelector} from 'react-redux'
import {updateDashboardActiveTab} from '../../../../redux/actions'

function TabPanel(props) {
    const {children, value, index, ...other} = props
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box style={{marginTop: 20}}>
                    {children}
                </Box>
            )}
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    tabContainer: {
        backgroundColor: '#7794aa'
    }
}))

export default function DashboardTabs({tabs = []}) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const dashboardActiveTab = useSelector(state => state.dashboardActiveTab)
    const handleChange = (event, newValue) => {
        dispatch(updateDashboardActiveTab(newValue))
    }
    return (
        <Fragment>
            <AppBar position="static" className={classes.tabContainer}>
                <Tabs value={dashboardActiveTab} onChange={handleChange} variant='scrollable' scrollButtons='auto'>
                    {tabs.map(({name}) =>
                        <Tab key={uuid()}
                             label={`${name}`} />
                    )}
                </Tabs>
            </AppBar>
            {tabs.map(({panel}, index) => dashboardActiveTab === index && <TabPanel
                key={uuid()}
                value={dashboardActiveTab}
                index={index}>
                    {panel}
            </TabPanel>)}
        </Fragment>
    )
}