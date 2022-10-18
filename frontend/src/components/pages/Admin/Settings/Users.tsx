import React, { Fragment, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import TableCell from '@mui/material/TableCell'
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone'
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { baseRoutes } from '../../../UI/Layout/Navigation/Header'
import Loader from '../../../UI/Layout/Loader'
import Alert from '../../../UI/Layout/Alert'
import Paper from '@mui/material/Paper'
import AddUser from '../AddUser'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'
import EditUser from '../EditUser'

const styles = {
	buttonWith: {
		minWidth: '40px'
	}
}

const updatedBaseRoutes = [...baseRoutes].reduce((acc: any, val: any) => {
	acc[val['route']] = val['title']
	return acc
}, {})

const Users = () => {
	const [addNewUser, setAddNewUser] = useState(false)
	const [editUser, setEditUser] = useState(false)
	const { users, loading, error } = useTypedSelector(state => state.users)
	const addUserState = useTypedSelector(state => state.addUser)
	const editUserState = useTypedSelector(state => state.editUser)
	const { deleteUserByName, fetchUsers, getUser } = useActions()
	function handleDelete(username: string) {
		if (window.confirm(`Are you sure you want to delete user: ${username}?`)) {
			deleteUserByName(username)
			window.location.reload()
		}
	}

	function handleEdit(id: number) {
		setEditUser(!editUser)
		getUser(id)
	}

	const checkAction = () => {
		if (editUser) {
			setEditUser(false)
		} else if (addNewUser) {
			setAddNewUser(false)
		} else if (!addNewUser) {
			setAddNewUser(true)
		}
	}

	useEffect(() => {
		if (addUserState.state === 'added') setAddNewUser(false)
		if (editUserState.state === 'edited') setEditUser(false)
	}, [addUserState.state, editUserState.state])

	useEffect(() => {
		if (!addNewUser || (!addNewUser && !editUser)) fetchUsers()
	}, [fetchUsers, addNewUser, editUser])
	return (
		<Paper sx={{ padding: '30px' }}>
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<>
					<Grid container justifyContent="space-between" alignItems="center">
						<Grid item>
							<Typography>
								<b>{addNewUser ? 'Add User' : editUser ? 'Edit User' : 'All Users'}</b>
							</Typography>
						</Grid>
						<Grid item>
							<Button
								endIcon={addNewUser ? <PeopleOutlineIcon /> : <AddTwoToneIcon />}
								onClick={() => checkAction()}
								disabled={loading}
								size="small"
								variant="contained"
								color="primary"
							>
								{addNewUser ? 'Users' : editUser ? 'Users' : 'Add User'}
							</Button>
						</Grid>
					</Grid>
					<hr />
					{addNewUser ? (
						<AddUser />
					) : editUser ? (
						<EditUser />
					) : (
						<TableContainer>
							<Table size="small" sx={{ marginTop: '20px', backgroundColor: '#fff' }}>
								<TableHead>
									<TableRow>
										<TableCell align="center">
											<b>ID</b>
										</TableCell>
										<TableCell align="center">
											<b>USERNAME</b>
										</TableCell>
										<TableCell align="center">
											<b>ADMIN</b>
										</TableCell>
										<TableCell align="center">
											<b>ALLOWED_PAGES</b>
										</TableCell>
										<TableCell />
									</TableRow>
								</TableHead>
								<TableBody>
									{users.map((user: any, i: number) => (
										<TableRow key={i}>
											<TableCell align="center">{user['ID']}</TableCell>
											<TableCell align="center">{user['USERNAME']}</TableCell>
											<TableCell align="center">
												{user.ROLE === 'admin' ? (
													<CheckTwoToneIcon fontSize="small" style={{ color: 'green' }} />
												) : (
													<ClearTwoToneIcon fontSize="small" style={{ color: 'red' }} />
												)}
											</TableCell>
											<TableCell align="center">
												{user['ALLOWED_PAGES'] === null
													? 'Dashboard'
													: user['ALLOWED_PAGES'] === 'ALL'
													? 'All pages'
													: (user['ALLOWED_PAGES'] || '')
															.split(',')
															.map((route: any) => <Fragment key={route}>{updatedBaseRoutes[route]}, &nbsp;</Fragment>)}
											</TableCell>
											<TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
												<Button
													title="Delete user"
													sx={styles.buttonWith}
													onClick={() => handleDelete(user['USERNAME'])}
													component="span"
													color="inherit"
												>
													<DeleteOutlineRoundedIcon style={{ color: 'red' }} />
												</Button>
												<Button
													title="Edit user"
													sx={styles.buttonWith}
													onClick={(e: any) => handleEdit(user['ID'])}
													component="span"
													color="inherit"
												>
													<CreateOutlinedIcon color="action" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</>
			)}
		</Paper>
	)
}

export default Users
