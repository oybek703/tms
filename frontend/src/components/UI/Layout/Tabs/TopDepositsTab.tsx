import React from 'react'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import { v4 as uuid } from 'uuid'
import { makeStyles } from '@material-ui/core'
import blueGrey from '@material-ui/core/colors/blueGrey'

const useStyles = makeStyles((theme) => ({
  content: {
    marginBottom: 10
  },
  btn: {
    marginRight: 20,
    border: `1px solid ${blueGrey[500]}`,
    borderRadius: '5px !important',
    padding: '6px 10px',
    borderRightColor: `${blueGrey[500]} !important`,
    fontSize: 15,
    lineHeight: 1,
    textTransform: 'lowercase',
    fontWeight: 560
  }
}))

interface TopDepositsTabProps {
    active: number
    handleChange: (index: number) => void
}

const TopDepositsTab: React.FC<TopDepositsTabProps> = ({ active = 1, handleChange }) => {
  const titles = [
    { title: 'ДЕПОЗИТЫ ДО ВОСТРЕБОВАНИЯ', code: '20200' },
    { title: 'СРОЧНЫЕ ДЕПОЗИТЫ', code: '20600' },
    { title: 'СБЕРЕГАТЕЛЬНЫЕ ДЕПОЗИТЫ', code: '20400' },
    { title: 'ДЕПОЗИТЫ КЛИЕНТОВ ПО АККРЕДИТИВАМ', code: '22602' },
    {
      title: 'ЗАРЕЗЕРВИРОВАННЫЕ СРЕДСТВА КЛИЕНТОВ ДЛЯ КОНВЕРТАЦИИ',
      code: '22613'
    },
    { title: 'СРЕДСТВА КЛИЕНТОВ, СКОНВЕРТИРОВАННЫЕ', code: '22614' }
  ]
  const classes = useStyles()
  return (
    <div className={classes.content}>
      <ButtonGroup disableElevation size='small' color="primary">
        {titles.map(({ title, code }, i) =>
          <Button classes={{ root: classes.btn }}
            title={`${title} - ${code}`}
            onClick={handleChange.bind(null, i + 1)} size='small'
            key={uuid()}
            variant={`${active === i + 1 ?
                          'contained' :
                          'outlined'}`}>{title}</Button>)}
      </ButtonGroup>
    </div>
  )
}

export default TopDepositsTab
