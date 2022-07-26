import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { v4 as uuid } from 'uuid'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    borderRadius: 5,
    backgroundColor: '#fff',
    border: '3px solid #333',
    width: '15%',
  },
  tab: {
    textAlign: 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  tabData: {
    width: '84%',
    paddingLeft: '1%',
  },
  selectedTab: {
    backgroundColor: theme.palette.info.light,
    color: '#fff',
  },
}))

function TabPanel(props: any) {
  const { children, value, index, ...other } = props
  const classes = useStyles()
  return (
    <div
      role="tabpanel"
      className={classes.tabData}
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
  value: PropTypes.any.isRequired,
}

function a11yProps(index: number) {
  return {
    'id': `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

interface VerticalTabsProps {
  tabs: {
    tabName: string
    tabData: JSX.Element | undefined
  }[]
}

const VerticalTabs: React.FC<VerticalTabsProps> = function({ tabs = [] }) {
  const classes = useStyles()
  const { hash } = useLocation()
  const [value, setValue] = React.useState(hash ? +hash[1] : 0)
  const tabNames = tabs.map((tab) => tab['tabName'])
  const tabDatas = tabs.map((tab) => tab['tabData'])
  const handleChange = (event: React.ChangeEvent, newValue: any) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      {/*
        //@ts-ignore*/}
      <Tabs onChange={handleChange}
        orientation="vertical"
        variant="scrollable"
        value={value}
        className={classes.tabs}
      >
        {tabNames.map((tabName, index) => <Tab classes={{
          wrapper: classes.tab,
          root: classes.tab,
          selected: classes.selectedTab,
        }} key={uuid()} className={classes.tab} href={`#${index}`}
        component='a'
        label={tabName}
        {...a11yProps(index)} />)}
      </Tabs>
      <hr/>
      {/*
        //@ts-ignore*/}
      {tabDatas.map((tabData, index) => <TabPanel component={<div/>} key={uuid()}
        value={value} index={index}>
        {tabData}
      </TabPanel>)}
    </div>
  )
}

export default VerticalTabs
