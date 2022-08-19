import React, { Fragment, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone'
import TableCell from '@material-ui/core/TableCell'
import CheckTwoToneIcon from '@material-ui/icons/CheckTwoTone'
import ClearTwoToneIcon from '@material-ui/icons/ClearTwoTone'
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded'
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'
import { baseRoutes } from '../../../UI/Layout/Navigation/Header'
import Loader from '../../../UI/Layout/Loader'
import Alert from '../../../UI/Layout/Alert'
import Paper from '@material-ui/core/Paper'
import AddUser from '../AddUser'
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'
import EditUser from '../EditUser'

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
  buttonWith: {
    minWidth: '40px'
  }
}))


const updatedBaseRoutes = [...baseRoutes].reduce((acc: any, val: any) => {
  acc[val['route']] = val['title']
  return acc
}, {})

const Users = () => {
  const [addNewUser, setAddNewUser] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const classes = useStyles()
  const { users, loading, error } = useTypedSelector((state) => state.users)
  const { state } = useTypedSelector((state) => state.addUser)
  const { deleteUserByName, fetchUsers } = useActions()
  function handleDelete(username: string) {
    if (window.confirm(`Are you sure you want to delete user: ${username}?`)) {
      deleteUserByName(username)
      window.location.reload()
    }
  }

  const checkAction = () => {
    if (editUser) {
      setEditUser(false)
    } else
    if (addNewUser) {
      setAddNewUser(false)
    } else if (!addNewUser) {
      setAddNewUser(true)
    }
  }

  useEffect(() => {
    if (state === 'added') setAddNewUser(false)
  }, [state])

  useEffect(() => {
    if (!addNewUser) fetchUsers()
  }, [fetchUsers, addNewUser])
  return (
    <Paper className={classes.paddingMain}>
      {
                loading ?
                    <Loader/> :
                    error ?
                    <Alert message={error}/> :
                    <>
                      <Grid container justifyContent='space-between' alignItems='center'>
                        <Grid item>
                          <Typography><b>{addNewUser ? 'Add User' : editUser ? 'Edit User' : 'All Users'}</b></Typography>
                        </Grid>
                        <Grid item>
                          <Button
                            endIcon={addNewUser ? <PeopleOutlineIcon/> : <AddTwoToneIcon/>}
                            onClick={() => checkAction()}
                            disabled={loading} size='small'
                            variant='contained' color='primary'>{addNewUser ? 'Users' : editUser ? 'Users' : 'Add User'}</Button>
                        </Grid>
                      </Grid>
                      <hr/>
                      {addNewUser ? <AddUser/> : editUser ? <EditUser/> : <TableContainer>
                        <Table size='small' className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell align="center"><b>ID</b></TableCell>
                              <TableCell align="center"><b>USERNAME</b></TableCell>
                              <TableCell align="center"><b>ADMIN</b></TableCell>
                              <TableCell align="center"><b>ALLOWED_PAGES</b></TableCell>
                              <TableCell/>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {users.map((user: any, i: number) => (
                              <TableRow key={i}>
                                <TableCell align='center'>{user['ID']}</TableCell>
                                <TableCell align='center'>{user['USERNAME']}</TableCell>
                                <TableCell align='center'>
                                  {
                                                    user.ROLE === 'admin' ?
                                                        <CheckTwoToneIcon fontSize='small'
                                                          style={{ color: 'green' }}/> :
                                                        <ClearTwoToneIcon fontSize='small' style={{ color: 'red' }}/>}
                                </TableCell>
                                <TableCell align='center'>
                                  {
                                                    user['ALLOWED_PAGES'] === null ? 'Dashboard':
                                                    user['ALLOWED_PAGES'] === 'ALL' ?
                                                        'All pages' :
                                                        (user['ALLOWED_PAGES'] || '').split(',')
                                                            .map((route: any) => <Fragment
                                                              key={route}>{updatedBaseRoutes[route]}, &nbsp;</Fragment>)
                                  }
                                </TableCell>
                                <TableCell className={classes.actionCol}>
                                  <Button title='Delete user' className={classes.buttonWith}
                                    onClick={() => handleDelete(user['USERNAME'])} component='span'
                                    color='inherit'>
                                    <DeleteOutlineRoundedIcon style={{ color: 'red' }}/>
                                  </Button>
                                  <Button title='Delete user' className={classes.buttonWith}
                                    onClick={() => setEditUser(!editUser)}
                                    component='span'
                                    color='inherit'>
                                    <CreateOutlinedIcon color= 'action'/>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>}
                    </>
      }
    </Paper>
  )
}

export default Users
