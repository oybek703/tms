import React, { Fragment } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { v4 as uuid } from 'uuid'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'

function TabPanel(props: any) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box style={{ marginTop: 20 }}>
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

interface DashboardTabsProps {
    tabs: {name: string; panel: JSX.Element}[]
}

const DashboardTabs: React.FC<DashboardTabsProps> = function({ tabs = [] }) {
  const classes = useStyles()
  const { updateDashboardActiveTab } = useActions()
  const dashboardActiveTab = useTypedSelector((state) => state.dashboardActiveTab)
  const handleChange = (event: React.ChangeEvent, newValue: any) => {
    updateDashboardActiveTab(newValue)
  }
  return (
    <Fragment>
      <AppBar position="static" className={classes.tabContainer}>
        {/*
                // @ts-ignore*/}
        <Tabs onChange={handleChange}
          value={dashboardActiveTab}
          variant='scrollable' scrollButtons='auto'>
          {tabs.map(({ name }) =>
            <Tab key={uuid()}
              label={`${name}`} />
          )}
        </Tabs>
      </AppBar>
      {tabs.map(({ panel }, index) => dashboardActiveTab === index && <TabPanel
        key={uuid()}
        value={dashboardActiveTab}
        index={index}>
        {panel}
      </TabPanel>)}
    </Fragment>
  )
}

export default DashboardTabs
