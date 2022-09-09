import { combineReducers } from 'redux'
import mainIndicators from './Treasury/mainIndicatorsReducer'
import capital from './Treasury/capitalReducer'
import liquidity, { liquidityCurrent, liquidityCurrentState } from './Treasury/liquidityReducer'
import date from './dates/dateReducer'
import correspondent, { correspondentCurrent, correspondentCurrentState } from './Treasury/correspondentReducer'
import operDays from './dates/operDaysReducer'
import profitAndLost from './Treasury/profitAndLostReducer'
import currencyPosition from './Treasury/currenncyPositionReducer'
import auth from './Admin/userReducer'
import users from './Admin/userListReducer'
import { dashboard, dashboardActiveTab } from './Anayltics/dashboardReducer'
import addUser from './Admin/addUserReducer'
import calcFor from './Treasury/calcForReducer'
import gm from './Treasury/GMReducer'
import plat from './Treasury/platReducer'
import interbankdeposits from './Treasury/interbankDepositsReducer'
import topDeposits from './Treasury/topDepositsReducer'
import timeDepoClients from './Treasury/timeDepoClientsReducer'
import timeDeposits from './Treasury/timeDepositsReducer'
import lastUpdate from './dates/lastUpdateReducer'
import dashboardMonthly from './Anayltics/dashboardMonthlyReducer'
import depositsByDeadline from './Anayltics/depositsByDeadlineReducer'
import reportLiabilities from './Anayltics/reportLiabilitiesReducer'
import fcrb from './Anayltics/fcrbReducer'
import gap from './Anayltics/gapReducer'
import bankLimits from './Admin/bankLimits'
import gapManual from './Admin/gapManual'
import nostroMatrix from './Anayltics/nostroMatrixReducer'
import editUser from './Admin/editUserReducer'
import getUser from './Admin/getUserReducer'
import getAddedBanks from './Admin/getAddedBanks'
import lastGapUpdate from './Anayltics/lastGapUpdateReducer'
import searchAllBanks from './Admin/searchAllBanks'

const rootReducer = combineReducers({
  auth,
  date,
  operDays,
  lastUpdate,
  dashboard,
  dashboardActiveTab,
  dashboardMonthly,
  mainIndicators,
  profitAndLost,
  capital,
  liquidity,
  liquidityCurrentState,
  liquidityCurrent,
  correspondent,
  correspondentCurrentState,
  correspondentCurrent,
  currencyPosition,
  calcFor,
  interbankdeposits,
  plat,
  topDeposits,
  timeDepoClients,
  timeDeposits,
  depositsByDeadline,
  gm,
  reportLiabilities,
  fcrb,
  nostroMatrix,
  gap,
  bankLimits,
  gapManual,
  users,
  addUser,
  getUser,
  editUser,
  getAddedBanks,
  lastGapUpdate,
  searchAllBanks
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
