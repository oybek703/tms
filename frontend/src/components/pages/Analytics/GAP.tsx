import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import GAPTable from '../../tables/GAPTable'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const GAP = () => {
    const { fetchGap } = useActions()
    const { gap, loading, error } = useTypedSelector(state => state.gap)
    useEffect(() => {
        fetchGap()
    }, [fetchGap])
    return (
      <>
          <PageTitle title='Анализ ликвидности по источникам и потребности'/>
          {loading
            ? <Loader/>
            : error
              ? <Alert message={error}/>
              : <GAPTable rows={gap}/>}
      </>
    )
}

export default GAP
