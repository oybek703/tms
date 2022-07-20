import 'colors'
import { join, resolve } from 'path'
import express, { Express, Request, Response } from 'express'
import { checkConnection } from './src/models/db_apis'
import morgan from 'morgan'
import { address } from 'ip'
import cors from 'cors'
import userRoutes from './src/routes/Admin/auth'
import operDayRoutes from './src/routes/operDays'
import mainIndicatorsRoutes from './src/routes/Treasury/mainIndicators'
import notFoundPage from './src/middleware/notFound'
import errorHandler from './src/middleware/errorHandler'
import profitAndLostRoutes from './src/routes/Treasury/profitAndLost'
import capitalRoutes from './src/routes/Treasury/capital'
import liquidityRoutes from './src/routes/Treasury/liquidity'
import correspondentRoutes from './src/routes/Treasury/correspondent'
import calcForRoutes from './src/routes/Treasury/calcFor'
import currencyPositionRoutes from './src/routes/Treasury/currencyPosition'
import platRoutes from './src/routes/Treasury/plat'
// const dashboardRoutes = require('./src/routes/Analytics/dashboard')
// const gmRoutes = require('./src/routes/Treasury/gm')
// const interbankDepositsRoutes = require('./src/routes/Treasury/interbankDeposits')
// const topDepositsRoutes = require('./src/routes/Treasury/topDeposits')
// const timeDepoClientsRoutes = require('./src/routes/Treasury/timeDepoClients')
// const timeDepositsRoutes = require('./src/routes/Treasury/timeDeposits')
// const dashboardMonthlyRoutes = require('./src/routes/Analytics/dashboardMonthly')
// const depositsByDeadlineRoutes = require('./src/routes/Analytics/depositsByDeadline')
// const reportLiabilitiesRoutes = require('./src/routes/Analytics/reportLiabilities')
// const gapRoutes = require('./src/routes/Analytics/gap')
// const fcrbRoutes = require('./src/routes/Analytics/fcrb')
// const bankLimitsRoutes = require('./src/routes/Admin/Manual/bankLimits')
// const gapManualRoutes = require('./src/routes/Admin/Manual/gapManual')
const app: Express = express()
const port = process.env.PORT || 4200

if (process.env.NODE_ENV === 'development' ||
    address().startsWith('192.168.')) {
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(cors())

app.use('/api/auth', userRoutes)
app.use('/api/oper_days', operDayRoutes)
app.use('/api/mainindicators', mainIndicatorsRoutes)
app.use('/api/profitandlost', profitAndLostRoutes)
app.use('/api/capital', capitalRoutes)
app.use('/api/liquidity', liquidityRoutes)
app.use('/api/correspondent', correspondentRoutes)
app.use('/api/calcfor', calcForRoutes)
app.use('/api/currencyposition', currencyPositionRoutes)
app.use('/api/plat', platRoutes)
// app.use('/api/banklimits', bankLimitsRoutes)
// app.use('/api/gapsimulation', gapManualRoutes)
// app.use('/api/correspondent', correspondentRoutes)
// app.use('/api/dashboard', dashboardRoutes)
// app.use('/api/gm', gmRoutes)
// app.use('/api/interbankdeposits', interbankDepositsRoutes)
// app.use('/api/topdeposits', topDepositsRoutes)
// app.use('/api/timedepoclients', timeDepoClientsRoutes)
// app.use('/api/timedeposits', timeDepositsRoutes)
// app.use('/api/dashboardmonthly', dashboardMonthlyRoutes)
// app.use('/api/depositsbydeadline', depositsByDeadlineRoutes)
// app.use('/api/reportliabilities', reportLiabilitiesRoutes)
// app.use('/api/gap', gapRoutes)
// app.use('/api/fcrb', fcrbRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join(__dirname, '/client')))
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(resolve(__dirname, '../client', 'index.html'))
    })
} else {
    app.get('/', (req: Request, res: Response) => {
        res.send('API is running...')
    })
}

app.use(notFoundPage)
app.use(errorHandler)

checkConnection().then(() => {
    app.listen(
        port,
        console.log.bind(
            null,
            `Server is running in ${process.env.NODE_ENV} mode on port ${port}...`.yellow.bold
        )
    )
})