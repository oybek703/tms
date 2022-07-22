import React from 'react'
import Grid from '@material-ui/core/Grid'
import { v4 as uuid } from 'uuid'
import Card from '@material-ui/core/Card'
import { makeStyles, Typography } from '@material-ui/core'
import { formatNumber } from '../../../../utils'
import RWAPoints from '../../../charts/Dashboard/Capital/RWAPoints'
import CapitalPoints from '../../../charts/Dashboard/Capital/CapitalPoints'

const useStyles = makeStyles(theme => ({
    greens: {
        color: '#00B050',
        fontSize: '12pt',
    },
    smallCardContainer: theme.mixins.smallCardContainer,
    smallCard: theme.mixins.smallCard,
    capitalText: {
        padding: 10,
        fontSize: '1.2em',
        fontWeight: 600,
        color: '#555',
    },
    capitalNumber: {
        fontSize: '1.05em',
    },
}))

interface CapitalTabProps {
    vla: any
}

const CapitalTab: React.FC<CapitalTabProps> = ({ vla = { categories: [] } }) => {
    const classes = useStyles()
    const capitalPoints: any = {
        rc: 6183.7,
        car: 14.24,
        rwa: 43432.64,
        forecast: 14.05,
    }
    const forecastCategories = Object.assign([], vla.categories)
    const now = new Date()
    const current = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const nextMonth = new Date(current).toLocaleDateString('ru',{ month: 'long' })
    // @ts-ignore
    const nextMonthSliced = [...nextMonth].map((letter, index) => index === 0 ? letter.toUpperCase() : letter)
        .slice(0, 3)
        .join('')
    forecastCategories.shift()
    forecastCategories.push(nextMonthSliced)
    return (
        <>
            <Grid container justifyContent='space-between' alignItems='center'
                  spacing={2}>
                {[
                    { title: 'Регулативний капитал', shortKey: 'rc' },
                    {
                        title: 'Коэффициент адекватности капитала',
                        shortKey: 'car',
                    },
                ].map(
                    ({ title, shortKey }, i) => <Grid key={uuid()} item sm={6}>
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
            <Grid spacing={2} container justifyContent='space-between'>
                <Grid item sm={6}>
                    <RWAPoints
                        data={{
                            ...vla,
                            series: [
                                5940.72,
                                5944.44,
                                5902.41,
                                6221.8,
                                6177.2,
                                6183.7],
                        }} id='rc'/>
                </Grid>
                <Grid item sm={6}>
                    <CapitalPoints
                        data={{
                            ...vla,
                            series: [14.23, 13.51, 13.10, 13.83, 13.68, 14.24],
                        }} id='car' label='Коеф. адек. капитала'
                        normative={13}/>
                </Grid>
            </Grid>
            <Grid container justifyContent='space-between' alignItems='center'
                  spacing={2}>
                {[
                    {
                        title: 'Активы взвешенные с учетом риска',
                        shortKey: 'rwa',
                    },
                    {
                        title: 'Прогноз коэффициента адекватности капитала',
                        shortKey: 'forecast',
                    },
                ].map(
                    ({ title, shortKey }, i) => <Grid key={uuid()} item sm={6}>
                        <Card>
                            <Typography
                                className={`${classes.greens} ${classes.capitalText}`}
                                align='center'>
                                {title}
                                &nbsp;
                                <span
                                    className={`${classes.greens} ${classes.capitalNumber}`}>
                                                                {formatNumber(capitalPoints[shortKey])} {i ===
                                1 && '%'}
                                                            </span>
                            </Typography>
                        </Card>
                    </Grid>)}
            </Grid>
            <Grid spacing={2} container justifyContent='space-between'>
                <Grid item sm={6}>
                    <RWAPoints data={{
                        ...vla,
                        series: [
                            41753.69,
                            44008.56,
                            45056.56,
                            44976.20,
                            45162.35,
                            43432.64],
                    }} id='rwa'/>
                </Grid>
                <Grid item sm={6}>
                    <CapitalPoints
                        data={{
                            ...vla,
                            categories: forecastCategories,
                            series: [14.30, 13.80, 13.90, 13.95, 14.10, 14.05],
                        }} id='forecast' label='Прогноз' normative={13}/>
                </Grid>
            </Grid>
        </>
    )
}

export default CapitalTab