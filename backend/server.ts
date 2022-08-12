import 'colors'
import { join, resolve } from 'path'
import express, { Express, Request, Response } from 'express'
import { checkConnection } from './src/models/db_apis'
import morgan from 'morgan'
import cors from 'cors'
import notFoundPage from './src/middleware/notFound'
import errorHandler from './src/middleware/errorHandler'
import userRoutes from './src/routes/Admin/auth'
import operDayRoutes from './src/routes/operDays'
import dashboardRoutes from './src/routes/Analytics/dashboard'
import mainIndicatorsRoutes from './src/routes/Treasury/mainIndicators'
import profitAndLostRoutes from './src/routes/Treasury/profitAndLost'
import capitalRoutes from './src/routes/Treasury/capital'
import liquidityRoutes from './src/routes/Treasury/liquidity'
import correspondentRoutes from './src/routes/Treasury/correspondent'
import calcForRoutes from './src/routes/Treasury/calcFor'
import currencyPositionRoutes from './src/routes/Treasury/currencyPosition'
import platRoutes from './src/routes/Treasury/plat'
import interbankDepositsRoutes from './src/routes/Treasury/interbankDeposits'
import topDepositsRoutes from './src/routes/Treasury/topDeposits'
import timeDepoClientsRoutes from './src/routes/Treasury/timeDepoClients'
import timeDepositsRoutes from './src/routes/Treasury/timeDeposits'
import depositsByDeadlineRoutes from './src/routes/Analytics/depositsByDeadline'
import reportLiabilitiesRoutes from './src/routes/Analytics/reportLiabilities'
import gmRoutes from './src/routes/Treasury/gm'
import dashboardMonthlyRoutes from './src/routes/Analytics/dashboardMonthly'
import fcrbRoutes from './src/routes/Analytics/fcrb'
import gapRoutes from './src/routes/Analytics/gap'
import gapManualRoutes from './src/routes/Admin/Manual/gapManual'
import bankLimitsRoutes from './src/routes/Admin/Manual/bankLimits'
import nostroMatrixRoutes from './src/routes/Analytics/nostroMatrix'

const app: Express = express()
const port: string = process.env.PORT || '4200'

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(cors())

app.use('/api/auth', userRoutes)
app.use('/api/operDays', operDayRoutes)
app.use('/api/mainindicators', mainIndicatorsRoutes)
app.use('/api/profitandlost', profitAndLostRoutes)
app.use('/api/capital', capitalRoutes)
app.use('/api/liquidity', liquidityRoutes)
app.use('/api/correspondent', correspondentRoutes)
app.use('/api/calcfor', calcForRoutes)
app.use('/api/currencyposition', currencyPositionRoutes)
app.use('/api/plat', platRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/interbankdeposits', interbankDepositsRoutes)
app.use('/api/topdeposits', topDepositsRoutes)
app.use('/api/timedepoclients', timeDepoClientsRoutes)
app.use('/api/timedeposits', timeDepositsRoutes)
app.use('/api/depositsbydeadline', depositsByDeadlineRoutes)
app.use('/api/reportliabilities', reportLiabilitiesRoutes)
app.use('/api/gm', gmRoutes)
app.use('/api/dashboardmonthly', dashboardMonthlyRoutes)
app.use('/api/fcrb', fcrbRoutes)
app.use('/api/gap', gapRoutes)
app.use('/api/gapSimulation', gapManualRoutes)
app.use('/api/banklimits', bankLimitsRoutes)
app.use('/api/nostroMatrix', nostroMatrixRoutes)

if (process.env.NODE_ENV === 'development') {
  app.get('/', (req: Request, res: Response) => {
    res.send('API is running...')
  })
} else {
  app.use(express.static(join(__dirname, '../client')))
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(resolve(__dirname, '../client', 'index.html'))
  })
}

app.use(notFoundPage)
app.use(errorHandler)

checkConnection().then((_) => {
  app.listen(
      port,
      console.log.bind(
          null,
          `Server is running in ${process.env.NODE_ENV} mode on port ${port}...`.yellow.bold,
      ),
  )
})
