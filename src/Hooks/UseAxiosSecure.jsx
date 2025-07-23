import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router'; // fix: use 'react-router-dom'
import UseAuth from './UseAuth';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});

function UseAxiosSecure() {
    const navigate = useNavigate();
    const { logOut } = UseAuth();

    useEffect(() => {
        // Request interceptor (optional here)
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => config,
            (error) => Promise.reject(error)
        );

        // Response interceptor
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            (error) => {
                
                const status = error?.response?.status;
                console.log(status)
                if (status === 401) {
                    console.warn('Unauthorized. Logging out...');
                    logOut()
                        .then(() => navigate('/auth/login'))
                        .catch(() => { });
                } else if (status === 403) {
                    console.warn('Forbidden. Redirecting...');
                    navigate('/forbidden');
                }
                return Promise.reject(error);
            }
        );

        // Cleanup: remove interceptor when component unmounts
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logOut, navigate]);

    return axiosSecure;
}

export default UseAxiosSecure;
