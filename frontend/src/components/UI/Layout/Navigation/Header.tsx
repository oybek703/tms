import React, { Fragment, memo, useCallback, useEffect, useState } from 'react'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Grid from '@mui/material/Grid'
import Toolbar from '@mui/material/Toolbar'
import { Button, Typography } from '@mui/material'
import Navbar from './Navbar'
import Drawer from '@mui/material/Drawer'
import { Link, useHistory, useLocation } from 'react-router-dom'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMore from '@mui/icons-material/ExpandMore'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import Collapse from '@mui/material/Collapse'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TimelineIcon from '@mui/icons-material/Timeline'
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import globalStyles from '../../../../styles/globalStyles'
import { ISxStyles } from '../../../../interfaces/styles.interface'

interface BaseRoute {
	title: string
	route: string
	group: string
	forAll?: boolean
}

export const baseRoutes: BaseRoute[] = [
	{
		title: 'Основные показатели',
		route: '/mainIndicators',
		group: 'key_indicators'
	},
	{ title: 'Расчет капитала', route: '/capital', group: 'key_indicators' },
	{
		title: 'Прибыл и убыток банка',
		route: '/profitAndLost',
		group: 'key_indicators'
	},
	{
		title: 'Ликвидность',
		route: '/liquidity',
		group: 'liquidity_indicators'
	},
	{
		title: 'Корреспондентский счет',
		route: '/correspondent',
		group: 'liquidity_indicators'
	},
	{
		title: 'Расчет ФОР',
		route: '/calcFor',
		group: 'liquidity_indicators',
		forAll: true
	},
	{
		title: 'Валютная позиция',
		route: '/currencyPosition',
		group: 'liquidity_indicators'
	},
	{
		title: 'Матрица вал. корр. счетов',
		route: '/nostroMatrix',
		group: 'liquidity_indicators',
		forAll: true
	},
	{
		title: 'Буфер ВЛА',
		route: '/vlaBuffer',
		group: 'liquidity_indicators'
	},
	{
		title: 'Привлеченные и размещенные',
		route: '/plat',
		group: 'active_passive',
		forAll: true
	},
	{
		title: 'Межбанковские депозиты',
		route: '/interbankDeposits',
		group: 'active_passive'
	},
	{
		title: 'Топ-20 крупных депозитов',
		route: '/topDeposits',
		group: 'active_passive'
	},
	{
		title: 'СД юр.лиц. - по клиентам',
		route: '/timeDepoClients',
		group: 'active_passive'
	},
	{
		title: 'Срочные депозиты юр. лиц',
		route: '/timeDeposits',
		group: 'active_passive'
	},
	{
		title: 'Депозиты по срокам',
		route: '/depositsByDeadline',
		group: 'active_passive'
	},
	{
		title: 'Отчет об обязательствах',
		route: '/reportLiabilities',
		group: 'active_passive'
	},
	{ title: 'Эффективност филиалов', route: '/filialEffectiveness', group: 'active_passive' },
	{ title: 'АО "UzAuto Motors"', route: '/gm', group: 'active_passive' },
	{ title: 'ГЭП', route: '/gap', group: 'gap' },
	{ title: 'ГЭП симуляция', route: '/gapSimulation', group: 'gap' },
	{
		title: 'Капитал',
		route: '/in_process/n1',
		group: 'prudential_standards'
	},
	{
		title: 'Ликвидность',
		route: '/in_process/n2',
		group: 'prudential_standards'
	},
	{
		title: 'Крупные риски',
		route: '/in_process/n3',
		group: 'prudential_standards'
	},
	{
		title: 'Ценные бумаги',
		route: '/in_process/n4',
		group: 'prudential_standards'
	},
	{
		title: 'Связанниые лица',
		route: '/in_process/n5',
		group: 'prudential_standards'
	},
	{
		title: 'Инвестиции банка',
		route: '/in_process/n6',
		group: 'prudential_standards'
	}
]

const styles: ISxStyles = {
	active: {
		...globalStyles.active,
		backgroundColor: '#636363',
		color: '#fff',
		'&:hover': {
			backgroundColor: '#8b8b8b',
			color: '#fff'
		}
	}
}

function groupRoutes(routes: BaseRoute[] = [], indicatorName = 'key_indicators'): any {
	return routes.map(route => route['group'] === indicatorName && route).filter(Boolean)
}

interface GroupedRoutesProps {
	routes: BaseRoute[]
	handleAnchorClose: () => void
	Icon: any
	title: string
}

const GroupedRoutes: React.FC<GroupedRoutesProps> = ({ routes = [], handleAnchorClose, Icon, title }) => {
	const { pathname } = useLocation()
	const isRouteCovered = Boolean(routes.find(({ route }) => route === pathname))
	const [open, setOpen] = useState(isRouteCovered)
	if (!routes.length) return <Fragment />
	return (
		<>
			<ListItem button onClick={setOpen.bind(null, !open)}>
				<ListItemIcon>
					<Icon />
				</ListItemIcon>
				<ListItemText primary={`${title} `} />
				{open ? <ExpandMore /> : <ChevronRightIcon />}
			</ListItem>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{routes.map(({ title, route }, index) => (
						<ListItem
							button
							key={index}
							disableRipple
							sx={{
								paddingLeft: '40px',
								...(route === pathname && styles.active)
							}}
							onClick={handleAnchorClose}
							component={Link}
							to={route}
						>
							<ListItemText>
								<Typography sx={{ fontSize: '16px', maxWidth: 210 }}>{title}</Typography>
							</ListItemText>
						</ListItem>
					))}
				</List>
			</Collapse>
		</>
	)
}

function Header() {
	const { pathname } = useLocation()
	const { push } = useHistory()
	const [anchor, setAnchor] = useState(false)
	const [routes, setRoutes] = useState<BaseRoute[]>(baseRoutes)
	const {
		user: { pages = [], role }
	} = useTypedSelector(state => state.auth)
	const keyIndicatorsRoutes = groupRoutes(routes, 'key_indicators')
	const liquidityIndicatorsRoutes = groupRoutes(routes, 'liquidity_indicators')
	const activePassiveRoutes = groupRoutes(routes, 'active_passive')
	const prudentialStandardsRoutes = groupRoutes(routes, 'prudential_standards')
	const gapRoutes = groupRoutes(routes, 'gap')
	useEffect(() => {
		if (pages !== 'ALL') {
			const mappedPages = (pages || '').split(',')
			const allowedPages: any = baseRoutes
				.map(value => {
					if (mappedPages.includes(value['route']) || value['forAll']) {
						return value
					} else {
						return undefined
					}
				})
				.filter(Boolean)
			setRoutes(allowedPages)
		}
	}, [pages, role])
	const onMenuOpen = useCallback(() => setAnchor(!anchor), [anchor])
	const handleAnchorClose = useCallback(() => {
		setAnchor(false)
		if (pathname !== '/') push('/')
		//  eslint-disable-next-line
  }, [])

	const list = useCallback(
		() => (
			<Fragment>
				<Toolbar component={Grid} container sx={globalStyles.logo} alignItems="center" justifyContent="center">
					<Button onClick={handleAnchorClose}>
						<img src={process.env.PUBLIC_URL + '/logo.svg'} width="140" height="80" alt="Treasury Reports" />
					</Button>
				</Toolbar>
				<Divider />
				<List component="nav">
					<GroupedRoutes
						handleAnchorClose={handleAnchorClose}
						Icon={AccountBalanceIcon}
						routes={keyIndicatorsRoutes}
						title="Ключевые показатели"
					/>
					<GroupedRoutes
						handleAnchorClose={handleAnchorClose}
						Icon={TimelineIcon}
						routes={liquidityIndicatorsRoutes}
						title="Ликвидность банка"
					/>
					<GroupedRoutes
						handleAnchorClose={handleAnchorClose}
						Icon={CreditCardIcon}
						routes={activePassiveRoutes}
						title="Активы и пассивы"
					/>
					<GroupedRoutes
						handleAnchorClose={handleAnchorClose}
						Icon={AssessmentIcon}
						routes={gapRoutes}
						title="ГЭП Анализ"
					/>
					<GroupedRoutes
						handleAnchorClose={handleAnchorClose}
						Icon={FeaturedPlayListIcon}
						routes={prudentialStandardsRoutes}
						title="Пруденциальные нормативы"
					/>
				</List>
			</Fragment>
		),
		[
			handleAnchorClose,
			gapRoutes,
			keyIndicatorsRoutes,
			activePassiveRoutes,
			liquidityIndicatorsRoutes,
			prudentialStandardsRoutes
		]
	)

	return (
		<>
			<Navbar onMenuOpen={onMenuOpen} />
			<Drawer
				variant="temporary"
				transitionDuration={{ appear: 100, enter: 100, exit: 300 }}
				translate="yes"
				open={anchor}
				onClose={onMenuOpen}
			>
				{list()}
			</Drawer>
		</>
	)
}

export default memo(Header)
