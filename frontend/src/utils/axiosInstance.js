import axios from "axios"
import store from "../redux/store"
import {LOGOUT} from "../redux/actions/types"

const productionMode = process.env.NODE_ENV === 'production'

const axiosInstance = axios.create({
    baseURL: `http://${productionMode ? process.env.REACT_APP_SERVER_IP : 'localhost'}:4200`
})

axiosInstance.interceptors.request.use(
    function (config) {
        if (config.url.includes('dashboard')) {
            setTimeout(function () {
                localStorage.removeItem('dashboard')
            }, 1800000)
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        const {response = {}} = error
        const {status} = response
        if (status === 440) {
            localStorage.clear()
            window.location.reload()
            store.dispatch({type: LOGOUT})
        }
        return Promise.reject(error)
    }
)

export function withToken() {
    const {token} = JSON.parse(localStorage.getItem('user') || '{}')
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || ''}`
        }
    }
}

export default axiosInstance