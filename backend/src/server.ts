import 'colors'
import express, { Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import notFoundPage from './middleware/notFound'
import errorHandler from './middleware/errorHandler'
import userRoutes from './routes/Admin/auth'
import operDayRoutes from './routes/operDays'
import dashboardRoutes from './routes/Analytics/dashboard'
import creditDataRoutes from './routes/Analytics/creditData'
import mainIndicatorsRoutes from './routes/Treasury/mainIndicators'
import profitAndLostRoutes from './routes/Treasury/profitAndLost'
import capitalRoutes from './routes/Treasury/capital'
import liquidityRoutes from './routes/Treasury/liquidity'
import correspondentRoutes from './routes/Treasury/correspondent'
import calcForRoutes from './routes/Treasury/calcFor'
import currencyPositionRoutes from './routes/Treasury/currencyPosition'
import platRoutes from './routes/Treasury/plat'
import interbankDepositsRoutes from './routes/Treasury/interbankDeposits'
import topDepositsRoutes from './routes/Treasury/topDeposits'
import timeDepoClientsRoutes from './routes/Treasury/timeDepoClients'
import timeDepositsRoutes from './routes/Treasury/timeDeposits'
import depositsByDeadlineRoutes from './routes/Analytics/depositsByDeadline'
import reportLiabilitiesRoutes from './routes/Analytics/reportLiabilities'
import gmRoutes from './routes/Treasury/gm'
import dashboardMonthlyRoutes from './routes/Analytics/dashboardMonthly'
import fcrbRoutes from './routes/Analytics/fcrb'
import gapRoutes from './routes/Analytics/gap'
import gapManualRoutes from './routes/Admin/Manual/gapManual'
import bankLimitsRoutes from './routes/Admin/Manual/bankLimits'
import nostroMatrixRoutes from './routes/Analytics/nostroMatrix'
import vlaBufferRoutes from './routes/Analytics/vlaBuffer'
import filialEffectivenessRoutes from './routes/Analytics/filialEffectiveness'
import { checkConnection } from './models/db_apis'

const app: Express = express()
const port: string = process.env.PORT || '4200'

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(express.json())
app.use(cors())

app.use('/api/auth', userRoutes)
app.use('/api/operDays', operDayRoutes)
app.use('/api/mainIndicators', mainIndicatorsRoutes)
app.use('/api/profitAndLost', profitAndLostRoutes)
app.use('/api/capital', capitalRoutes)
app.use('/api/liquidity', liquidityRoutes)
app.use('/api/correspondent', correspondentRoutes)
app.use('/api/calcFor', calcForRoutes)
app.use('/api/currencyPosition', currencyPositionRoutes)
app.use('/api/plat', platRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/creditData', creditDataRoutes)
app.use('/api/interbankDeposits', interbankDepositsRoutes)
app.use('/api/topDeposits', topDepositsRoutes)
app.use('/api/timeDepoClients', timeDepoClientsRoutes)
app.use('/api/timeDeposits', timeDepositsRoutes)
app.use('/api/depositsByDeadline', depositsByDeadlineRoutes)
app.use('/api/reportLiabilities', reportLiabilitiesRoutes)
app.use('/api/gm', gmRoutes)
app.use('/api/dashboardMonthly', dashboardMonthlyRoutes)
app.use('/api/fcrb', fcrbRoutes)
app.use('/api/gap', gapRoutes)
app.use('/api/gapSimulation', gapManualRoutes)
app.use('/api/bankLimits', bankLimitsRoutes)
app.use('/api/nostroMatrix', nostroMatrixRoutes)
app.use('/api/vlaBuffer', vlaBufferRoutes)
app.use('/api/filialEffectiveness', filialEffectivenessRoutes)

app.use(notFoundPage)
app.use(errorHandler)

checkConnection().then((_) => {
	app.listen(
		port,
		console.log.bind(
			null,
			`Server is running in ${process.env.NODE_ENV} mode on port ${port}...`.yellow.bold
		)
	)
})
