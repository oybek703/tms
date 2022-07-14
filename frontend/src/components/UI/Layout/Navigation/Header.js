import React, {Fragment, memo, useCallback, useEffect, useState} from 'react'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import {Button, makeStyles, Typography} from '@material-ui/core'
import Navbar from './Navbar'
import Drawer from '@material-ui/core/Drawer'
import {Link, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ExpandMore from '@material-ui/icons/ExpandMore'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import Collapse from '@material-ui/core/Collapse'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import AssessmentIcon from '@material-ui/icons/Assessment'
import TimelineIcon from '@material-ui/icons/Timeline'
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList'

export const baseRoutes = [
    {title: 'Основные показатели', route: '/mainindicators', group: 'key_indicators'},
    {title: 'Расчет капитала', route: '/capital', group: 'key_indicators'},
    {title: 'Прибыл и убыток банка', route: '/profitandlost', group: 'key_indicators'},
    {title: 'Ликвидность', route: '/liquidity', group: 'liquidity_indicators'},
    {title: 'Корреспондентский счет', route: '/correspondent', group: 'liquidity_indicators'},
    {title: 'Расчет ФОР', route: '/calcfor', group: 'liquidity_indicators', for_all: true},
    {title: 'Валютная позиция', route: '/currencyposition', group: 'liquidity_indicators'},
    {title: 'Привлеченные и размещенные', route: '/plat', group: 'active_passive', for_all: true},
    {title: 'Межбанковские депозиты', route: '/interbankdeposits', group: 'active_passive'},
    {title: 'Топ-20 крупных депозитов', route: '/topdeposits', group: 'active_passive'},
    {title: 'СД юр.лиц. - по клиентам', route: '/timedepoclients', group: 'active_passive'},
    {title: 'Срочные депозиты юр. лиц', route: '/timedeposits', group: 'active_passive'},
    {title: 'Депозиты по срокам', route: '/depositsbydeadline', group: 'active_passive'},
    {title: 'Отчет об обязательствах', route: '/reportliabilities', group: 'active_passive'},
    {title: 'АО "UzAuto Motors" ', route: '/gm', group: 'active_passive'},
    {title: 'ГЭП', route: '/gap', group: 'gap'},
    {title: 'ГЭП симуляция', route: '/gapsimulation', group: 'gap'},
    {title: 'Капитал', route: '/in_process/n1', group: 'prudential_standards'},
    {title: 'Ликвидность', route: '/in_process/n2', group: 'prudential_standards'},
    {title: 'Крупные риски', route: '/in_process/n3', group: 'prudential_standards'},
    {title: 'Ценные бумаги', route: '/in_process/n4', group: 'prudential_standards'},
    {title: 'Связанниые лица', route: '/in_process/n5', group: 'prudential_standards'},
    {title: 'Инвестиции банка', route: '/in_process/n6', group: 'prudential_standards'}
]


const useStyles = makeStyles(theme => ({
    routes: {
        fontSize: '16px',
        maxWidth: 210
    },
    active: {
        ...theme.mixins.active,
        backgroundColor: '#636363',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#8b8b8b',
            color: '#fff'
        }
    },
    roundIcon: {
        minWidth: '25px'
    },
    logo: theme.mixins.logo,
    nested: {
        paddingLeft: theme.spacing(5)
    }
}))

function groupRoutes(routes = [], indicatorName = 'key_indicators') {
    return routes
        .map(route => route['group'] === indicatorName && route)
        .filter(Boolean)
}

function GroupedRoutes({routes = [], handleAnchorClose, Icon, title}) {
    const classes = useStyles()
    const {pathname} = useLocation()
    const isRouteCovered = Boolean(routes.find(r => r['route'] === pathname))
    const [open, setOpen] = useState(isRouteCovered)
    if(!routes.length) return <Fragment/>
    return <>
        <ListItem button onClick={setOpen.bind(null, !open)}>
            <ListItemIcon>
                <Icon/>
            </ListItemIcon>
            <ListItemText primary={`${title} `}/>
            {open ? <ExpandMore/> : <ChevronRightIcon/>}
        </ListItem>
        <Collapse in={open} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
                {routes.map(({title, route}, index) => (
                    <ListItem button key={index}
                              disableRipple
                              className={route === pathname
                                  ? `${classes.active} ${classes.nested}`
                                  :  classes.nested
                              }
                              onClick={handleAnchorClose}
                              component={Link} to={route}>
                        <ListItemText>
                            <Typography
                                classes={{root: classes.routes}}>{title}</Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </Collapse>
    </>
}

function Header() {
    const classes = useStyles()
    const [anchor, setAnchor] = useState(false)
    const [routes, setRoutes] = useState(baseRoutes)
    const {user: {pages = [], role}} = useSelector(state => state.auth)
    const keyIndicatorsRoutes = groupRoutes(routes, 'key_indicators')
    const liquidityIndicatorsRoutes = groupRoutes(routes, 'liquidity_indicators')
    const activePassivRoutes = groupRoutes(routes, 'active_passive')
    const prudentialStandardsRoutes = groupRoutes(routes, 'prudential_standards')
    const gapRoutes = groupRoutes(routes, 'gap')
    useEffect(() => {
        if(pages !== 'ALL') {
            const mappedPages = (pages || '').split(',')
            let allowedPages = baseRoutes.map(value => {
                if(mappedPages.includes(value['route']) || value['for_all']) {
                    return value
                } else {
                    return undefined
                }

            }).filter(Boolean)
            setRoutes(allowedPages)
        }
    }, [pages, role])
    const onMenuOpen = useCallback(() => setAnchor(!anchor), [anchor])
    const handleAnchorClose = useCallback(() => setAnchor(false), [])

    const list = useCallback(
        () => (<Fragment>
        <Toolbar component={Grid} container className={classes.logo}
                 alignItems='center' justify='center'>
            <Link to='/' onClick={handleAnchorClose}>
                <Button>
                    <img src={process.env.PUBLIC_URL + "/logo.svg"}
                         width='140' height='80' alt="Treasury Reports"/>
                </Button>
            </Link>
        </Toolbar>
        <Divider/>
        <List component='nav'>
            <GroupedRoutes handleAnchorClose={handleAnchorClose}
                           Icon={AccountBalanceIcon}
                           routes={keyIndicatorsRoutes}
                           title='Ключевые показатели' />
            <GroupedRoutes handleAnchorClose={handleAnchorClose}
                           Icon={TimelineIcon}
                           routes={liquidityIndicatorsRoutes}
                           title='Ликвидность банка' />
            <GroupedRoutes handleAnchorClose={handleAnchorClose}
                           Icon={CreditCardIcon}
                           routes={activePassivRoutes}
                           title='Активы и пассивы'/>
            <GroupedRoutes handleAnchorClose={handleAnchorClose}
                           Icon={AssessmentIcon}
                           routes={gapRoutes}
                           title='ГЭП Анализ'/>
            <GroupedRoutes handleAnchorClose={handleAnchorClose}
                           Icon={FeaturedPlayListIcon}
                           routes={prudentialStandardsRoutes}
                           title='Пруденциальные нормативы'/>
        </List>
    </Fragment>),
        [classes, handleAnchorClose, gapRoutes, keyIndicatorsRoutes,
            activePassivRoutes, liquidityIndicatorsRoutes, prudentialStandardsRoutes]
    )

    return (
        <>
            <Navbar onMenuOpen={onMenuOpen}/>
            <Drawer
                variant='temporary'
                transitionDuration={{appear: 100, enter: 100, exit: 300}}
                translate='yes'
                    open={anchor} onClose={onMenuOpen}>
                {list()}
            </Drawer>
        </>
    )
}

export default memo(Header)

