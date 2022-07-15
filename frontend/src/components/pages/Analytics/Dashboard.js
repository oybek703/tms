import React, { Fragment, memo, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Typography } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Valute from '../../UI/Layout/Dashboard/Valute'
import TimeDepositsChart from '../../charts/Dashboard/Funding/TimeDepositsChart'
import InterbankDepositsChart
    from '../../charts/Dashboard/Funding/InterbankDepositsChart'
import { useDispatch, useSelector } from 'react-redux'
import { formatNumber, getDashboardLiquidityIndicator } from '../../../utils'
import CreditPortfolio
    from '../../charts/Dashboard/CreditPortfolio/RiskPart/CreditPortfolio'
import CPBreakdown
    from '../../charts/Dashboard/CreditPortfolio/RiskPart/CPBreakdown'
import FundingStructure
    from '../../charts/Dashboard/CreditPortfolio/FundingStructure'
import CurrencyMFI from '../../charts/Dashboard/Funding/CurrencyMFI'
import CurrencyMBD from '../../charts/Dashboard/Funding/CurrencyMBD'
import CurrencyTimeDeposits
    from '../../charts/Dashboard/Funding/CurrencyTimeDeposits'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import { fetchDashboard } from '../../../redux/actions'
import DashboardTabs from '../../UI/Layout/Tabs/DashboardTabs'
import DashboardCurrencyRates, { ExternalCurrencyRates } from '../../UI/Layout/DashboardCurrencyRates'
import LiquidityPoints
    from '../../charts/Dashboard/DailyIndicators/LiquidityPoints'
import LiquidityCard from '../../UI/Layout/Dashboard/LiquidityCard'
import DashboardMonthly from '../../UI/Layout/DashboardMonthly'
import Position from '../../UI/Layout/DashboardCurrencyRates/Position'
import CurrencyPositionChart
    from '../../charts/Dashboard/DailyIndicators/CurrencyPositionChart'
import FakeSuspense from '../../UI/helpers/FakeSuspense'
import PlacedAndAttracted from '../Treasury/PlacedAndAttracted'
import CalcFor from '../Treasury/CalcFor'
import WithDetailsButton from '../../UI/Layout/Dashboard/WithDetailsButton'
import Fcrb from './Fcrb'
import CapitalPoints from '../../charts/Dashboard/Capital/CapitalPoints'
import RWAPoints from '../../charts/Dashboard/Capital/RWAPoints'
import Card from '@material-ui/core/Card'
import CurrencyRateLine
    from '../../UI/Layout/DashboardCurrencyRates/CurrencyRateLine'
import { v4 as uuid } from 'uuid'
import Covenants from '../../UI/Layout/Dashboard/Covenants'
import Normatives from '../../UI/Layout/Dashboard/Normatives'
import BankLimits from './BankLimits'

const useStyles = makeStyles(theme => ({
    margin: {
        marginBottom: '20px'
    },
    currency: {
        padding: '8px 0',
        fontSize: '12pt',
        color: '#636363'
    },
    grow: theme.mixins.grow,
    liqRate: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: '20px auto'
    },
    greens: {
        color: '#00B050',
        fontSize: '12pt'
    },
    smallCardContainer: theme.mixins.smallCardContainer,
    smallCard: theme.mixins.smallCard,
    liquidityCard: {
        ...theme.mixins.smallCard,
        padding: 0,
        paddingLeft: 5
    },
    horizontalTitle: theme.mixins.oneRowTitle,
    capitalText: {
        padding: 10,
        fontSize: '1.2em',
        fontWeight: 600,
        color: '#555'
    },
    capitalNumber: {
        fontSize: '1.05em'
    },
    noWrap: theme.mixins.noWrap
}))

const Dashboard = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const {reportDate} = useSelector(state => state.date)
    const {dashboard, loading, error} = useSelector(state => state.dashboard)
    const {
        dashboardCorrespondent = {},
        creditPart = [],
        disaggregatedByTime = [],
        dashboardCurrencyPosition = {},
        timeDeposits = [],
        currencyMfi = [],
        currencyTimeDeposits = [],
        issuedCredits = [],
        interbankDeposits = [],
        fundingStructure = [],
        currencyMBD = [],
        vla = {},
        lcr = {},
        nsfr = {},
        currencyRates,
        bankLimits = []
    } = dashboard
    const {vlaCurrent = []} = vla
    const {currencyPosition = [], position = []} = dashboardCurrencyPosition
    const {cbRate = [], legalEntitiesRates = [], individualsRates = [], last90Rates = {}} = currencyRates
    const [lcrLastPointers, nsfrLastPointers] = [lcr, nsfr].map(getDashboardLiquidityIndicator)
    const mfiSum = Number(currencyMfi.reduce((a, b) => +a + (+b), 0)).toFixed(2)
    const mbdSum = Number(currencyMBD.reduce((a, b) => +a + (+b), 0)).toFixed(2)
    const currencyTimeDepositsSum = Number(currencyTimeDeposits.reduce((a, b) => +a + (+b), 0)).toFixed(2)
    const capitalPoints = {rc: 6177.2, car: 13.68, rwa: 45162.35, forecast: 14.05}
    useEffect(() => {
        dispatch(fetchDashboard(reportDate))
    }, [dispatch, reportDate])
    useEffect(() => {
        window.scrollTo({left: 0, top: 0, behavior: 'smooth'})
    }, [])
    return (
        <Fragment>
            {loading
                ? <Loader/>
                : error
                    ? <Alert message={error}/>
                    : <>
                        <DashboardTabs
                            tabs={[
                                {
                                    name: 'Eжедневные показатели', panel: <Fragment>
                                        {/*CURRENCY(CORRESPONDENT) RATE*/}
                                        <Grid container justify='center' component={Paper}
                                              className={classes.horizontalTitle}>
                                            Остатки корреспондентских счетов
                                        </Grid>
                                        {/*LIQUIDITY RATE*/}
                                        <Grid container justify='space-between' className={classes.liqRate}>
                                            {dashboardCorrespondent.map(({value, differ, image}) => (
                                                <Valute key={image} number={value} differ={differ} image={image}/>
                                            ))}
                                        </Grid>
                                        <Grid container justify='center' component={Paper}
                                              className={classes.horizontalTitle}>
                                            Показатели ликвидности</Grid>
                                        {/*VLA LCR NSFR*/}
                                        <Grid className={classes.smallCardContainer} container>
                                            {[
                                                {label: 'ВЛА', data: vlaCurrent},
                                                {label: 'LCR', data: lcrLastPointers},
                                                {label: 'NSFR', data: nsfrLastPointers}
                                            ].map(({data, label}) => (
                                                <LiquidityCard key={uuid()} data={data} label={label}/>
                                            ))}
                                        </Grid>
                                        <FakeSuspense>
                                            <Grid container
                                                  justify='space-between' className={classes.smallCardContainer}>
                                                <Grid item xs={12} sm={6} className={classes.smallCard}
                                                      md={4} component={Paper}><LiquidityPoints data={vla} id='vla'
                                                                                                normative={10}/></Grid>
                                                <Grid item xs={12} sm={6} className={classes.smallCard}
                                                      md={4} component={Paper}><LiquidityPoints data={lcr}
                                                                                                id='lcr'/></Grid>
                                                <Grid item xs={12} sm={6} className={classes.smallCard}
                                                      md={4} component={Paper}><LiquidityPoints data={nsfr}
                                                                                                id='nsfr'/></Grid>
                                            </Grid>
                                        </FakeSuspense>
                                        <Grid container justify='center' component={Paper} style={{marginBottom: 10}}
                                              className={classes.horizontalTitle}>Валютные позиции</Grid>
                                        <Grid container justify='space-between' spacing={1}>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Position position={position}/>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={8}>
                                                <CurrencyPositionChart series={currencyPosition}/>
                                            </Grid>
                                        </Grid>
                                    </Fragment>
                                },
                                {
                                    name: 'Курсы валют', panel: <Fragment>
                                        <Grid container justify='center' component={Paper}
                                              className={classes.horizontalTitle}>Курсы валют</Grid>
                                        <br/>
                                        {/*CURRENCY RATES*/}
                                        <Grid className={classes.smallCardContainer} container justify='space-between'>
                                            {['Курсы ЦБ', 'Курсы для юр. лиц', 'Курсы для физ. лиц']
                                                .map(title => <Grid component={Paper}
                                                                    item
                                                                    key={uuid()}
                                                                    xs={12} sm={6} md={4}
                                                                    className={`${classes.smallCard} ${classes.horizontalTitle}`}>
                                                    {title}
                                                </Grid>)}
                                        </Grid>
                                        <Grid container justify='space-between' className={classes.smallCardContainer}>
                                            <Grid item xs={12} sm={6} className={classes.smallCard}
                                                  md={4} component={Paper}>
                                                <DashboardCurrencyRates cbRate={cbRate}/>
                                            </Grid>
                                            <Grid item xs={12} sm={6} className={classes.smallCard}
                                                  md={4} component={Paper}>
                                                <ExternalCurrencyRates rates={legalEntitiesRates}/>
                                            </Grid>
                                            <Grid item xs={12} sm={6} className={classes.smallCard}
                                                  md={4} component={Paper}>
                                                <ExternalCurrencyRates rates={individualsRates}/>
                                            </Grid>
                                        </Grid>
                                        <CurrencyRateLine last90Rates={last90Rates}/>
                                    </Fragment>
                                },
                                {name: 'ЦРБ', panel: <Fcrb/>},
                                {name: 'Лимиты', panel: <BankLimits rows={bankLimits}/>},
                                {
                                    name: 'ФОР', panel: <WithDetailsButton link={'/calcfor'}>
                                        <CalcFor forDashboard/>
                                    </WithDetailsButton>
                                },
                                {
                                    name: 'Активы и пассивы', panel: <WithDetailsButton link='/plat'>
                                        <PlacedAndAttracted forDashboard/>
                                    </WithDetailsButton>
                                },
                                {
                                    name: 'Капитал', panel: <Fragment>
                                        <Grid container justify='space-between' alignItems='center' spacing={2}>
                                            {[
                                                {title: 'Регулативний капитал', shortKey: 'rc'},
                                                {title: 'Коэффициент адекватности капитала', shortKey: 'car'}
                                            ].map(({title, shortKey}, i) => <Grid key={uuid()} item sm={6}>
                                                <Card>
                                                    <Typography
                                                        className={`${classes.greens} ${classes.capitalText}`}
                                                        align='center'>
                                                        {title}
                                                        &nbsp;
                                                        <span
                                                            className={`${classes.greens} ${classes.capitalNumber}`}>
                                                                {formatNumber(capitalPoints[shortKey])} {i === 1 && '%'}
                                                            </span>
                                                    </Typography>
                                                </Card>
                                            </Grid>)}
                                        </Grid>
                                        <Grid spacing={2} container justify='space-between'>
                                            <Grid item sm={6}>
                                                <RWAPoints
                                                    data={{
                                                        ...vla,
                                                        series: [5933.4, 5940.72, 5944.44, 5902.41, 6221.8, 6177.2]
                                                    }} id='rc'/>
                                            </Grid>
                                            <Grid item sm={6}>
                                                <CapitalPoints
                                                    data={{
                                                        ...vla,
                                                        series: [14.37, 14.23, 13.51, 13.10, 13.83, 13.68]
                                                    }} id='car' label='Коеф. адек. капитала' normative={13}/>
                                            </Grid>
                                        </Grid>
                                        <Grid container justify='space-between' alignItems='center' spacing={2}>
                                            {[
                                                {title: 'Активы взвешенные с учетом риска', shortKey: 'rwa'},
                                                {
                                                    title: 'Прогноз коэффициента адекватности капитала',
                                                    shortKey: 'forecast'
                                                }
                                            ]
                                                .map(({title, shortKey}, i) => <Grid key={uuid()} item sm={6}>
                                                    <Card>
                                                        <Typography
                                                            className={`${classes.greens} ${classes.capitalText}`}
                                                            align='center'>
                                                            {title}
                                                            &nbsp;
                                                            <span
                                                                className={`${classes.greens} ${classes.capitalNumber}`}>
                                                                {formatNumber(capitalPoints[shortKey])} {i === 1 && '%'}
                                                            </span>
                                                        </Typography>
                                                    </Card>
                                                </Grid>)}
                                        </Grid>
                                        <Grid spacing={2} container justify='space-between'>
                                            <Grid item sm={6}>
                                                <RWAPoints data={{
                                                    ...nsfr,
                                                    series: [41281.38, 41753.69, 44008.56, 45056.56, 44976.20, 45162.35]
                                                }} id='rwa'/>
                                            </Grid>
                                            <Grid item sm={6}>
                                                <CapitalPoints
                                                    data={{
                                                        ...vla,
                                                        series: [14.30, 13.80, 13.90, 13.95, 14.10, 14.05]
                                                    }} id='forecast' label='Прогноз' normative={13}/>
                                            </Grid>
                                        </Grid>
                                    </Fragment>
                                },
                                {
                                    name: 'Фондирование', panel: <Fragment>
                                        {/* CREDIT DEPOSITS */}
                                        <Grid className={classes.smallCardContainer} container justify='space-between'>
                                            <Grid className={classes.smallCard} item component={Paper}>МФИ &nbsp; <span
                                                className={classes.greens}>{formatNumber(+mfiSum)} млрд.</span></Grid>
                                            <Grid className={classes.smallCard} item component={Paper}>МБД &nbsp; <span
                                                className={classes.greens}>{formatNumber(+mbdSum)} млрд.</span></Grid>
                                            <Grid className={classes.smallCard} item component={Paper}>Срочные
                                                депозиты &nbsp;
                                                <span
                                                    className={classes.greens}>{formatNumber(+currencyTimeDepositsSum)} млрд.</span></Grid>
                                        </Grid>
                                        {/* CREDIT SECOND BAR ROWS */}
                                        <Grid spacing={2} container justify='space-between'>
                                            <Grid item sm={6} md={4}>
                                                <CurrencyMFI series={currencyMfi}/>
                                            </Grid>
                                            <Grid item sm={6} md={4}>
                                                <CurrencyMBD series={currencyMBD}/>
                                            </Grid>
                                            <Grid item sm={6} md={4}>
                                                <CurrencyTimeDeposits series={currencyTimeDeposits}/>
                                            </Grid>
                                        </Grid>
                                        {/*DEPOSITS GRAPHS*/}
                                        <Grid spacing={2} container justify='space-between'>
                                            <Grid item sm={6}>
                                                <TimeDepositsChart series={timeDeposits}/>
                                            </Grid>
                                            <Grid item sm={6}>
                                                <InterbankDepositsChart series={interbankDeposits}/>
                                            </Grid>
                                        </Grid>
                                    </Fragment>
                                },
                                {
                                    name: 'Нормативы',
                                    panel: <Normatives/>
                                },
                                {
                                    name: 'Ковенанты', panel: <Covenants/>
                                },
                                {
                                    name: 'Кредитный портфель', panel: <Grid>
                                        {/* Выдача кредитов */}
                                        <Grid container justify='center'>
                                            <Grid className={classes.horizontalTitle} container justify='center'
                                                  component={Paper}>
                                                Выдача кредитов
                                            </Grid>
                                            <Grid className={classes.smallCardContainer} container>
                                                {['UZS', 'USD', 'EUR'].map((v, i) => (
                                                    <Grid className={classes.smallCard} key={i} item
                                                          component={Paper}>{v} &nbsp;
                                                        <span className={classes.greens}>
                                                    {formatNumber(issuedCredits[i])} {i === 0 ? 'млрд.' : 'млн.'} </span>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                        {/* Выдача кредитов COLS */}
                                        <Grid className={classes.horizontalTitle} container justify='center'
                                              component={Paper}>
                                            <span>Качество кредитного портфеля</span>
                                        </Grid>
                                        {/* Качество кредитного портфеля CHARTS */}
                                        <br/>
                                        <Grid spacing={2} container justify='space-between'>
                                            <Grid item sm={6} md={4}>
                                                <CreditPortfolio series={creditPart.slice(1)}/>
                                            </Grid>
                                            <Grid item sm={6} md={4}>
                                                <CPBreakdown series={disaggregatedByTime}/>
                                            </Grid>
                                            <Grid item sm={6} md={4}>
                                                <FundingStructure series={fundingStructure}/>
                                            </Grid>
                                        </Grid>
                                        {/* Качество кредитного портфеля NUMBERS */}
                                        <Grid className={classes.smallCardContainer} container>
                                            {['КП', 'NPL', 'ПР'].map((v, i) => (
                                                <Grid key={i} className={classes.smallCard} item component={Paper}>
                                                    <span>{v} &nbsp;</span>
                                                    <span className={classes.greens}>
                                                {formatNumber(+creditPart[i])} млн.
                                            </span>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                },
                                {name: 'Dashboard', panel: <DashboardMonthly/>},
                            ]}/>
                    </>
            }
        </Fragment>
    )
}

export default memo(Dashboard)