import React, { Fragment, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import TableCell from '@material-ui/core/TableCell'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import { baseRoutes } from '../../../UI/Layout/Navigation/Header'
import Loader from '../../../UI/Layout/Loader'
import Alert from '../../../UI/Layout/Alert'
import Paper from '@material-ui/core/Paper'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: 20,
    backgroundColor: '#fff'
  },
  actionCol: {
    textAlign: 'center',
    whiteSpace: 'nowrap'
  },
  actionBtn: {
    color: 'white',
    background: 'gray',
    padding: 3,
    borderRadius: 5
  },
  paddingMain: {
    padding: 30
  },
  formControl: {
    width: '200px'
  },
  buttonWith: {
    minWidth: '40px'
  }
}))


const updatedBaseRoutes = [...baseRoutes].reduce((acc: any, val: any) => {
  acc[val['route']] = val['title']
  return acc
}, {})

const Banks = () => {
  const classes = useStyles()
  const { banks, loading, error } = useTypedSelector((state) => state.getAddedBanks)
  const getBanksState = useTypedSelector((state) => state.getAddedBanks)
  const { getAddedBanks } = useActions()
  const [allBanks, setAllBanks] = useState(true)

  useEffect(() => {
    getAddedBanks()
  }, [])

  const handleChangeSort = (e: React.ChangeEvent<{ value: unknown }>) => {
    console.log(e.target.value)
  }

  const handleChangeCode = (e: React.ChangeEvent<{ value: unknown }>) => {
    console.log(e.target.value)
  }

  const handleChangeRating = (e: React.ChangeEvent<{ value: unknown }>) => {
    console.log(e.target.value)
  }

  return (
    <Paper className={classes.paddingMain}>
      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item>
          <Typography><b>{'All Banks'}</b></Typography>
        </Grid>
        <Grid>
          <TextField
            variant="outlined"
            onChange={handleChangeCode}
            id="username"
            label="Client code"
            name="code"
            autoComplete="off"
          />
        </Grid>
        <Grid item>
          <FormControl variant={'outlined'}>
            <InputLabel id="demo-simple-select-outlined-label">Sort</InputLabel>
            <Select
              value={'all'}
              labelId="demo-simple-select-outlined-label"
              onChange={handleChangeSort}
              id="demo-simple-select-outlined"
              className={classes.formControl}
              label="Sort"
            >
              <MenuItem
                value={'all'}>All</MenuItem>
              <MenuItem
                value={'not_added'}>Not added
              </MenuItem>
              <MenuItem
                value={'not_added'}>Added
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid>
          <Button variant='contained' color='primary'>
            <SearchIcon/>
          </Button>
        </Grid>
      </Grid>
      <hr/>
      {
                loading ?
                    <Loader/> :
                    error ?
                        <Alert message={error}/> :
                        <>
                          <TableContainer>
                            {
                                    allBanks ?
                                        <Table size='small' className={classes.table}>
                                          <TableHead>
                                            <TableRow>
                                              <TableCell align="center"><b>CODE</b></TableCell>
                                              <TableCell align="center"><b>NAME</b></TableCell>
                                              <TableCell align="center"><b>RATING</b></TableCell>
                                              <TableCell align="center"><b>RESIDENCY</b></TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {banks.map((bank: any, i: number) => (
                                              <TableRow key={i}>
                                                <TableCell align='center'>{bank['CLIENT_CODE']}</TableCell>
                                                <TableCell align='center'>{bank['BANK_NAME']}</TableCell>
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                  <Select
                                                    value={bank['RATING_STATUS']}
                                                    onChange={handleChangeRating}
                                                    id="demo-simple-select-outlined"
                                                  >
                                                    <MenuItem
                                                      value={'Инвестиционный'}>Инвестиционный</MenuItem>
                                                    <MenuItem value={'Не инвестиционный'}>Не
                                                                    инвестиционный</MenuItem>
                                                  </Select>
                                                </FormControl>
                                                <TableCell align='center'>{bank['RESIDENCY']}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table> :
                                        <Table size='small' className={classes.table}>
                                          <TableHead>
                                            <TableRow>
                                              <TableCell align="center"><b>CODE</b></TableCell>
                                              <TableCell align="center"><b>NAME</b></TableCell>
                                              <TableCell align="center"><b>RATING</b></TableCell>
                                              <TableCell align="center"><b>RESIDENCY</b></TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {banks.map((bank: any, i: number) => (
                                              <TableRow key={i}>
                                                <TableCell align='center'>{bank['CLIENT_CODE']}</TableCell>
                                                <TableCell align='center'>{bank['BANK_NAME']}</TableCell>
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                  <Select
                                                    value={bank['RATING_STATUS']}
                                                    onChange={handleChangeRating}
                                                    id="demo-simple-select-outlined"
                                                  >
                                                    <MenuItem
                                                      value={'Инвестиционный'}>Инвестиционный</MenuItem>
                                                    <MenuItem value={'Не инвестиционный'}>Не
                                                                    инвестиционный</MenuItem>
                                                  </Select>
                                                </FormControl>
                                                <TableCell align='center'>{bank['RESIDENCY']}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                            }
                          </TableContainer>
                        </>
      }
    </Paper>
  )
}

export default Banks
