import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import AllowedPages from '../../UI/Layout/Navigation/AllowedPages'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const useStyles = makeStyles((theme) => ({
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: 'crimson'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(3),
        backgroundColor: '#fff',
        padding: 40,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        padding: '10px 20px',
        minWidth: 250
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    }
}))

export default function AddUser() {
    const classes = useStyles()
    const {addUser} = useActions()
    const [allowedPages, setAllowedPages] = useState([])
    const {loading, error} = useTypedSelector(state => state.addUser)
    const [formData, setFormData] = useState({username: '', password: '', confirmpassword: ''})
    const [userNameHelperText, setUsernameHelperText] = useState('')
    const [passwordHelperText, setPasswordHelperText] = useState('')
    const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(true)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
        switch (name) {
            case 'username':
                /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(value) ? setUsernameHelperText('') : setUsernameHelperText('Please enter valid username.')
                break
            case 'password':
                value.length >= 6 ? setPasswordHelperText('') : setPasswordHelperText('Password should contain at least 6 characters.')
                break
            case 'confirmpassword':
                value === formData.password ? setConfirmPasswordHelperText('') : setConfirmPasswordHelperText('Password confirmation should match.')
                break
            default:
                return
        }
    }

    const handleAddPage = useCallback((newPages) => {
        setAllowedPages(Array.from(newPages))
    }, [])
    function handleAddUser(e: FormEvent) {
        e.preventDefault()
        addUser({...formData, allowedPages})
    }

    useEffect(() => {
        const btnStatus = !!formData.username && !!formData.password && !!formData.confirmpassword &&
            !userNameHelperText && !passwordHelperText && !confirmPasswordHelperText && !loading
        setBtnDisabled(!btnStatus)
        // eslint-disable-next-line
    }, [formData, loading])

    useEffect(() => {
        if (error) {
            switch (error) {
                case 'match_password':
                    setConfirmPasswordHelperText('Password confirmation should match.')
                    break
                case 'user_exists':
                    setUsernameHelperText('Username already exists. Please choose another username')
                    break
                default:
                    return
            }
        }
        // eslint-disable-next-line
    }, [error])

    return (
        <>
            <Typography align='center' component="h1" variant="h5">
                <b>ADD NEW USER</b>
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleAddUser}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            error={!!userNameHelperText}
                            helperText={userNameHelperText}
                            variant="outlined"
                            fullWidth
                            value={formData.username}
                            onChange={handleChange}
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={!!passwordHelperText}
                            helperText={passwordHelperText}
                            variant="outlined"
                            fullWidth
                            value={formData.password}
                            onChange={handleChange}
                            id="password"
                            type='password'
                            label="Password"
                            name="password"
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={!!confirmPasswordHelperText}
                            helperText={confirmPasswordHelperText}
                            variant="outlined"
                            fullWidth
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            name="confirmpassword"
                            label="Confirm Password"
                            type="password"
                            id="confirm_password"
                            autoComplete="off"
                        />
                    </Grid>
                    <AllowedPages pages={allowedPages} setPages={handleAddPage}/>
                </Grid>
                <Button
                    disabled={btnDisabled}
                    type="submit"
                    variant="outlined"
                    color="primary"
                    className={classes.submit}>
                    Add
                </Button>
            </form>
        </>
    )
}
