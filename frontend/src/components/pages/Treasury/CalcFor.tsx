import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import useTypedSelector from '../../../hooks/useTypedSelector'
import CalcForTable from '../../tables/CalcForTable'
import useActions from '../../../hooks/useActions'

interface CalcForProps {
    forDashboard: boolean
}

const CalcFor: React.FC<CalcForProps> = ({ forDashboard = false }) => {
  const { fetchCalcFor } = useActions()
  const { calcfor = [], loading, error } = useTypedSelector(state => state.calcFor)
  console.log(calcfor)
  const { reportDate } = useTypedSelector(state => state.date)
  const { DATE_VALUE: startDate } = [...calcfor].shift() || {}
  const { DATE_VALUE: endDate } = [...calcfor].pop() || {}
  useEffect(() => {
    fetchCalcFor(reportDate)
  }, [reportDate, fetchCalcFor])
  useEffect(() => {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
  },
  [])
  return (
    <>
      {!forDashboard &&
          <PageTitle title={`РАСЧЕТ ФОР ${(loading || !(startDate && endDate)) ?
            '' :
            `C ${startDate} - ${endDate}`}`}/>
      }
      {loading ?
            <Loader/> :
            error ?
              <Alert message={error}/> :
              <CalcForTable forDashboard={forDashboard} rows={calcfor}/>}
    </>
  )
}

export default CalcFor
