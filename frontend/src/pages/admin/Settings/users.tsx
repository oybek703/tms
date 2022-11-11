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
import { baseRoutes } from '../../../components/UI/Layout/Navigation/Header'
import Loader from '../../../components/UI/Layout/Loader'
import Alert from '../../../components/UI/Layout/Alert'
import Paper from '@mui/material/Paper'
import AddUser from '../add-user'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import useTypedSelector from '../../../hooks/useTypedSelector'
import EditUser from '../edit-user'
import { ISxStyles } from '../../../interfaces/styles.interface'
import useActions from '../../../hooks/useActions'

const styles: ISxStyles = {
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
	const { users, usersError, usersLoading } = useTypedSelector(state => state.admin)
	const { fetchUsers, fetchSingleUser, deleteUserByName } = useActions()
	function handleDelete(userName: string) {
		if (window.confirm(`Are you sure you want to delete user: ${userName}?`)) {
			deleteUserByName(userName)
			window.location.reload()
		}
	}

	function handleEdit(id: number) {
		setEditUser(!editUser)
		fetchSingleUser(id)
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
		if (!addNewUser || (!addNewUser && !editUser)) fetchUsers()
	}, [fetchUsers, addNewUser, editUser])
	return (
		<Paper sx={{ padding: '30px' }}>
			{usersLoading ? (
				<Loader />
			) : usersError ? (
				<Alert message={usersError} />
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
								disabled={usersLoading}
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
											<TableCell align="center">{user['id']}</TableCell>
											<TableCell align="center">{user['userName']}</TableCell>
											<TableCell align="center">
												{user.role === 'admin' ? (
													<CheckTwoToneIcon fontSize="small" style={{ color: 'green' }} />
												) : (
													<ClearTwoToneIcon fontSize="small" style={{ color: 'red' }} />
												)}
											</TableCell>
											<TableCell align="center">
												{user['allowedPages'] === null
													? 'Dashboard'
													: user['allowedPages'] === 'ALL'
													? 'All pages'
													: (user['allowedPages'] || '')
															.split(',')
															.map(
																(route: any) =>
																	updatedBaseRoutes[route] && (
																		<Fragment key={route}>{updatedBaseRoutes[route]}, &nbsp;</Fragment>
																	)
															)}
											</TableCell>
											<TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
												<Button
													title="Delete user"
													sx={styles.buttonWith}
													onClick={() => handleDelete(user['id'])}
													component="span"
													color="inherit"
												>
													<DeleteOutlineRoundedIcon style={{ color: 'red' }} />
												</Button>
												<Button
													title="Edit user"
													sx={styles.buttonWith}
													onClick={() => handleEdit(user['id'])}
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
