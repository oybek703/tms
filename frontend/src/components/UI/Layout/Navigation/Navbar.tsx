import React, { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import { IconButton, makeStyles, Toolbar } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import { Link, useLocation } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Grow from '@material-ui/core/Grow'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Popper from '@material-ui/core/Popper'
import Tab from '@material-ui/core/Tab'
import PersonOutlineTwoToneIcon from '@material-ui/icons/PersonOutlineTwoTone'
import DatePicker from '../DatePicker'
import { useDispatch } from 'react-redux'
import { getLastUpdateTime, getOperDays, logout, updateDashboardActiveTab } from '../../../../redux/actions'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { CORRESPONDENT_CURRENT_UPDATE, LIQUIDITY_CURRENT_UPDATE } from '../../../../redux/actions/types'
import theme from '../../theme'
import useTypedSelector from '../../../../hooks/useTypedSelector'

const useStyles = makeStyles({
    appbar: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    notifications: {
        minWidth: '250px'
    },
    ntfsBtn: {
        display: 'inline-block',
        minWidth: '64px'
    },
    menu: {
        minWidth: 125,
        backgroundColor: '#f8f8f8',
        borderRadius: 0,
        color: '#000'
    },
    noWrap: {
        ...theme.mixins.noWrap,
        backgroundColor: '#5a5454',
        color: 'white',
        transform: 'scale(1)',
        '&:hover': {
            backgroundColor: '#5a5454',
            transform: 'scale(1.02)'
        }
    },
    menuItem: {
        '&:hover': {
            backgroundColor: '#827e7e',
            color: 'white'
        }
    },
    logo: theme.mixins.logo,
    main_logo: {
        display: 'flex',
        alignItems: 'center',
        fontSize: 20,
        textTransform: 'none'
    },
    fontItalic: {
        fontStyle: 'italic',
        color: '#5c5c5c'
    }
})

interface NavbarProps {
    onMenuOpen?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onMenuOpen = () => {} }) => {
    const anchorRef = useRef(null)
    const dispatch = useDispatch()
    const { user = {} } = useTypedSelector(state => state.auth)
    const correspondentCurrentState = useTypedSelector(
        state => state.correspondentCurrentState)
    const liquidityCurrentState = useTypedSelector(
        state => state.liquidityCurrentState)
    const [anchorEl, setAnchorEl] = useState(null)
    const [open, setOpen] = useState(false)
    const classes = useStyles()
    const { pathname } = useLocation()
    const { reportDate } = useTypedSelector(state => state.date)
    const { operDays, loading } = useTypedSelector(state => state.operDays)
    const { lastUpdate, loading: lastUpdateLoading } = useTypedSelector(
        state => state.lastUpdate)
    const handleClick = useCallback(() => {
        setAnchorEl(() => anchorRef.current && anchorRef.current)
        setOpen(true)
    }, [anchorRef])

    const setCorrCurrentState = useCallback((state) => {
        dispatch(({ type: CORRESPONDENT_CURRENT_UPDATE, payload: state }))
    }, [dispatch])

    const setLiqCurrentState = useCallback((state) => {
        dispatch(({ type: LIQUIDITY_CURRENT_UPDATE, payload: state }))
    }, [dispatch])

    const handleClose = useCallback(() => setOpen(false), [])

    function handleExit () {
        dispatch(logout())
    }

    function handleLogoClick () {
        dispatch(updateDashboardActiveTab(0))
    }

    useEffect(() => {
        if (pathname === '/') dispatch(getLastUpdateTime())
    }, [dispatch, pathname])
    useEffect(() => {
        if (pathname !== '/gap') dispatch(getOperDays())
        //    eslint-disable-next-line
    }, [dispatch])
    return (
        <Fragment>
            <AppBar color='secondary' position='fixed' elevation={0}
                    variant='outlined'>
                <Toolbar>
                    <Grid container className={classes.appbar}
                          alignItems='center'>
                        <Grid item>
                            <Grid container alignItems='center'>
                                <Grid item>
                                    <IconButton onClick={onMenuOpen}
                                                size='medium'>
                                        <MenuIcon fontSize='large'/>
                                    </IconButton>
                                </Grid>
                                <Button component={Link} to='/'
                                        onClick={handleLogoClick}
                                        className={classes.main_logo}>
                                    <img src={process.env.PUBLIC_URL +
                                    '/logo.png'}
                                         width='25' height='25'
                                         alt="Treasury Reports"/>
                                    <b>&nbsp;Treasury Management System</b>
                                </Button>
                                {pathname === '/' &&
                                <p className={classes.fontItalic}> &nbsp;
                                    {
                                        lastUpdateLoading || !lastUpdate
                                            ? ''
                                            : `Последнее обновление: ${lastUpdate}`}
                                </p>}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container alignItems='center'
                                  component='span'>
                                {
                                    (pathname === '/correspondent' ||
                                        pathname === '/liquidity')
                                        ? <>
                                            {
                                                pathname === '/correspondent'
                                                    ? <>
                                                        <FormControlLabel
                                                            control={<Checkbox
                                                                color='primary'
                                                                disabled={loading}
                                                                checked={correspondentCurrentState}
                                                                onChange={() => setCorrCurrentState(
                                                                    !correspondentCurrentState)}
                                                                name="correspondent_current_state"/>}
                                                            label="Текущие состояние"/> {!correspondentCurrentState &&
                                                    <DatePicker
                                                        reportDate={reportDate}
                                                        operDays={operDays}
                                                        disabled={loading ||
                                                        correspondentCurrentState}/>}
                                                    </>
                                                    : pathname === '/liquidity'
                                                    ? <>
                                                        <FormControlLabel
                                                            control={<Checkbox
                                                                color='primary'
                                                                disabled={loading}
                                                                checked={liquidityCurrentState}
                                                                onChange={() => setLiqCurrentState(
                                                                    !liquidityCurrentState)}
                                                                name="liquidity_current_state"/>}
                                                            label="Текущие состояние"/> {!liquidityCurrentState &&
                                                    <DatePicker
                                                        reportDate={reportDate}
                                                        operDays={operDays}
                                                        disabled={loading ||
                                                        liquidityCurrentState}/>}
                                                    </>
                                                    : ''
                                            }
                                        </>
                                        : pathname !== '/gap' &&
                                        <DatePicker
                                            reportDate={reportDate}
                                            operDays={operDays}
                                            disabled={loading}
                                        />}
                                <Tab disableRipple disableTouchRipple
                                     onMouseLeave={handleClose}
                                     ref={anchorRef} onMouseOver={handleClick}
                                     component='span' label={
                                    <Button onClick={handleClick}
                                            className={classes.noWrap}>
                                        <PersonOutlineTwoToneIcon
                                            fontSize='small'/>&nbsp;
                                        <b>{user.username}</b>
                                    </Button>
                                }/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            {/*
            // @ts-ignore */}
            <Popper anchorEl={anchorEl || <span>test</span>}
                style={{ zIndex: 10000 }}
                placement='bottom'
                open={open}
                role={undefined} transition>
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: 'center top' }}
                    >
                        <Paper variant='elevation' elevation={2}
                               classes={{ root: classes.menu }}
                               onMouseLeave={handleClose}>
                            <ClickAwayListener onClickAway={handleClose}>
                                {/*
                                // @ts-ignore */}
                                <MenuList component={List}
                                          onMouseEnter={handleClick}
                                          autoFocusItem={open}
                                          id="menu-list-grow"
                                          elevation={0}>
                                    {user.role === 'admin' &&
                                    <MenuItem onClick={handleClose}
                                              classes={{ root: classes.menuItem }}
                                              component={Link} to='/settings'>
                                        Settings
                                    </MenuItem>}
                                    <MenuItem
                                        classes={{ root: classes.menuItem }}
                                        onClick={handleExit}>
                                        Exit
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            <Toolbar/>
        </Fragment>
    )
}

export default memo(Navbar)