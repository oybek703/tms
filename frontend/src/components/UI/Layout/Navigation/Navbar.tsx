import React, { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import { IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Grow from '@mui/material/Grow'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import Popper from '@mui/material/Popper'
import Tab from '@mui/material/Tab'
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone'
import DatePicker from '../Pickers/DatePicker'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'
import LastUpdate from './LastUpdate'
import globalStyles from '../../../../styles/globalStyles'
import rootColors from '../../../../styles/palette'

const styles = {
	menu: {
		minWidth: 125,
		backgroundColor: '#f8f8f8',
		borderRadius: 0,
		color: '#000'
	},
	menuItem: {
		'&:hover': {
			backgroundColor: '#827e7e',
			color: 'white'
		}
	},
	mainLogo: {
		display: 'flex',
		alignItems: 'center',
		fontSize: 20,
		textTransform: 'none'
	}
}

interface NavbarProps {
	onMenuOpen?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onMenuOpen = () => {} }) => {
	const anchorRef = useRef(null)
	const { push } = useHistory()
	const {
		getLastUpdateTime,
		getOperDays,
		logout,
		correspondentCurrentUpdate,
		liquidityCurrentUpdate,
		updateDashboardActiveTab
	} = useActions()
	const { user = {} } = useTypedSelector(state => state.auth)
	const correspondentCurrentState = useTypedSelector(state => state.correspondentCurrentState)
	const liquidityCurrentState = useTypedSelector(state => state.liquidityCurrentState)
	const [anchorEl, setAnchorEl] = useState(null)
	const [open, setOpen] = useState(false)
	const { pathname } = useLocation()
	const { reportDate } = useTypedSelector(state => state.date)
	const { operDays, loading } = useTypedSelector(state => state.operDays)
	const { lastUpdate, loading: lastUpdateLoading } = useTypedSelector(state => state.lastUpdate)
	const handleClick = useCallback(() => {
		setAnchorEl(() => anchorRef.current && anchorRef.current)
		setOpen(true)
	}, [anchorRef])

	const setCorrCurrentState = useCallback(
		(state: unknown) => {
			correspondentCurrentUpdate(state)
		},
		[correspondentCurrentUpdate]
	)

	const setLiqCurrentState = useCallback(
		(state: unknown) => {
			liquidityCurrentUpdate(state)
		},
		[liquidityCurrentUpdate]
	)

	const handleClose = useCallback(() => setOpen(false), [])

	function handleExit() {
		logout()
	}

	function handleLogoClick() {
		if (pathname !== '/') push('/')
		updateDashboardActiveTab(0)
	}

	useEffect(() => {
		if (pathname === '/') getLastUpdateTime()
	}, [getLastUpdateTime, pathname])
	useEffect(() => {
		if (pathname !== '/gap') getOperDays()
		//    eslint-disable-next-line
    }, [getOperDays])
	return (
		<Fragment>
			<AppBar sx={{ bgcolor: '#eee' }} position="fixed" elevation={0} variant="outlined">
				<Toolbar>
					<Grid container sx={{ display: 'flex', justifyContent: 'space-between' }} alignItems="center">
						<Grid item>
							<Grid container alignItems="center">
								<Grid item>
									<IconButton onClick={onMenuOpen} size="medium">
										<MenuIcon fontSize="large" />
									</IconButton>
								</Grid>
								<Button onClick={handleLogoClick} sx={styles.mainLogo}>
									<img src={process.env.PUBLIC_URL + '/logo.png'} width="22" height="22" alt="Treasury Reports" />
									<b style={{ paddingBottom: 3, color: '#000' }}>&nbsp;Treasury Management System</b>
								</Button>
								{pathname === '/' && !lastUpdateLoading && lastUpdate && <LastUpdate label={lastUpdate} />}
							</Grid>
						</Grid>
						<Grid item>
							<Grid container alignItems="center" alignContent="center" component="span">
								{pathname === '/correspondent' || pathname === '/liquidity' ? (
									<>
										{pathname === '/correspondent' ? (
											<>
												<FormControlLabel
													control={
														<Checkbox
															color="primary"
															disabled={loading}
															checked={correspondentCurrentState}
															onChange={() => setCorrCurrentState(!correspondentCurrentState)}
															name="correspondent_current_state"
														/>
													}
													label={
														<Typography component="span" sx={{ color: '#333' }}>
															Текущие состояние
														</Typography>
													}
												/>{' '}
												{!correspondentCurrentState && (
													<DatePicker
														reportDate={reportDate}
														operDays={operDays}
														disabled={loading || correspondentCurrentState}
													/>
												)}
											</>
										) : pathname === '/liquidity' ? (
											<>
												<FormControlLabel
													control={
														<Checkbox
															color="primary"
															disabled={loading}
															checked={liquidityCurrentState}
															onChange={() => setLiqCurrentState(!liquidityCurrentState)}
															name="liquidity_current_state"
														/>
													}
													label={
														<Typography component="span" sx={{ color: '#333' }}>
															Текущие состояние
														</Typography>
													}
												/>{' '}
												{!liquidityCurrentState && (
													<DatePicker
														reportDate={reportDate}
														operDays={operDays}
														disabled={loading || liquidityCurrentState}
													/>
												)}
											</>
										) : (
											''
										)}
									</>
								) : (
									pathname !== '/gap' && <DatePicker reportDate={reportDate} operDays={operDays} disabled={loading} />
								)}
								<Tab
									disableRipple
									disableTouchRipple
									onMouseLeave={handleClose}
									ref={anchorRef}
									onMouseOver={handleClick}
									component="span"
									label={
										<Button
											variant="contained"
											onClick={handleClick}
											sx={{
												...globalStyles.noWrap,
												backgroundColor: '#5a5454',
												'&:hover': {
													transform: 'scale(1.03)'
												}
											}}
										>
											<PersonOutlineTwoToneIcon fontSize="small" />
											&nbsp;
											<b>{user.username}</b>
										</Button>
									}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Popper
				// @ts-ignore
				anchorEl={anchorEl || <span>test</span>}
				style={{ zIndex: 10000 }}
				placement="bottom"
				open={open}
				role={undefined}
				transition
			>
				{({ TransitionProps }) => (
					<Grow {...TransitionProps} style={{ transformOrigin: 'center top' }}>
						<Paper variant="elevation" elevation={2} sx={styles.menu} onMouseLeave={handleClose}>
							<ClickAwayListener onClickAway={handleClose}>
								{/*
								// @ts-ignore */}
								<MenuList
									component={List}
									onMouseEnter={handleClick}
									autoFocusItem={open}
									id="menu-list-grow"
									elevation={0}
								>
									{user.role === 'admin' && (
										<MenuItem onClick={handleClose} sx={styles.menuItem} component={Link} to="/settings">
											Settings
										</MenuItem>
									)}
									<MenuItem sx={styles.menuItem} onClick={handleExit}>
										Exit
									</MenuItem>
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</Fragment>
	)
}

export default memo(Navbar)
