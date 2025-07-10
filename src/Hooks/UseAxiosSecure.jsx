import axios from 'axios';

import { useNavigate } from 'react-router';
import UseAuth from './UseAuth';
const axiosSecure = axios.create({
    baseURL: `http://localhost:3000`,

});
function UseAxiosSecure() {
    const navigate = useNavigate()
    const { user } = UseAuth()
    const { logOut } = UseAuth()
    axiosSecure.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${user?.accessToken}`
        return config;

    }, err => {
        return Promise.reject(err);
    })
    axiosSecure.interceptors.response.use(response => {
        return response;
    }, (err => {

        const status = err.status;
        if (status === 403) {
            navigate("/forbiddrn")
        } else if (status === 401) {

            // logOut().then(() => {
            //     navigate("/auth/login")

            // }).catch((error) => {

            // })
        }
        return Promise.reject(err);



    }))
    return axiosSecure
}

export default UseAxiosSecure
