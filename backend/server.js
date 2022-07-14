const path = require('path')
require('dotenv').config({path: path.join(__dirname, './config/.env')})
const express = require('express')
const morgan = require('morgan')
const {address} = require('ip')
const cors = require('cors')
const userRoutes = require('./src/routes/Admin/auth')
const operDayRoutes = require('./src/routes/operDays')
const mainIndicatorsRoutes = require('./src/routes/Treasury/mainIndicators')
const profitAndLostRoutes = require('./src/routes/Treasury/profitAndLost')
const capitalRoutes = require('./src/routes/Treasury/capital')
const liquidityRoutes = require('./src/routes/Treasury/liquidity')
const correspondentRoutes = require('./src/routes/Treasury/correspondent')
const currencyPositionRoutes = require('./src/routes/Treasury/currencyPosition')
const dashboardRoutes = require('./src/routes/Analytics/dashboard')
const calcForRoutes = require('./src/routes/Treasury/calcFor')
const gmRoutes = require('./src/routes/Treasury/gm')
const interbankDepositsRoutes = require('./src/routes/Treasury/interbankDeposits')
const platRoutes = require('./src/routes/Treasury/plat')
const topDepositsRoutes = require('./src/routes/Treasury/topDeposits')
const timeDepoClientsRoutes = require('./src/routes/Treasury/timeDepoClients')
const timeDepositsRoutes = require('./src/routes/Treasury/timeDeposits')
const dashboardMonthlyRoutes = require('./src/routes/Analytics/dashboardMonthly')
const depositsByDeadlineRoutes = require('./src/routes/Analytics/depositsByDeadline')
const reportLiabilitiesRoutes = require('./src/routes/Analytics/reportLiabilities')
const gapRoutes = require('./src/routes/Analytics/gap')
const fcrbRoutes = require('./src/routes/Analytics/fcrb')
const bankLimitsRoutes = require('./src/routes/Admin/Manual/bankLimits')
const gapManualRoutes = require('./src/routes/Admin/Manual/gapManual')
const errorHandler = require('./src/middleware/errorHandler')
const notFoundPage = require('./src/middleware/notFound')
const {checkConnection} = require("./src/models/db_apis")

const app = express()
const port = process.env.PORT || 4200

if(process.env.NODE_ENV === 'development' || address().startsWith('192.168')) {
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(cors())
app.use('/api/auth', userRoutes)
app.use('/api/banklimits', bankLimitsRoutes)
app.use('/api/gapsimulation', gapManualRoutes)
app.use('/api/oper_days', operDayRoutes)
app.use('/api/mainindicators', mainIndicatorsRoutes)
app.use('/api/profitandlost', profitAndLostRoutes)
app.use('/api/capital', capitalRoutes)
app.use('/api/liquidity', liquidityRoutes)
app.use('/api/correspondent', correspondentRoutes)
app.use('/api/currencyposition', currencyPositionRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/calcfor', calcForRoutes)
app.use('/api/gm', gmRoutes)
app.use('/api/interbankdeposits', interbankDepositsRoutes)
app.use('/api/plat', platRoutes)
app.use('/api/topdeposits', topDepositsRoutes)
app.use('/api/timedepoclients', timeDepoClientsRoutes)
app.use('/api/timedeposits', timeDepositsRoutes)
app.use('/api/dashboardmonthly', dashboardMonthlyRoutes)
app.use('/api/depositsbydeadline', depositsByDeadlineRoutes)
app.use('/api/reportliabilities', reportLiabilitiesRoutes)
app.use('/api/gap', gapRoutes)
app.use('/api/fcrb', fcrbRoutes)

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
    })
} else {
   app.get('/', (req, res) => {
        res.send('API is running...')
   })
}

app.use(notFoundPage)
app.use(errorHandler)

checkConnection()
    .then(() => {
            app.listen(
              port,
              console.log.bind(
                null,
                `Server is running in ${process.env.NODE_ENV} mode on port ${port}...`.yellow.bold
              )
            )
})