// import axios from 'axios';
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router'; // fix: use 'react-router-dom'
// import UseAuth from './UseAuth';

// const axiosSecure = axios.create({
//     baseURL: 'http://localhost:3000',

// });

// function UseAxiosSecure() {
//     const navigate = useNavigate();
//     const { logOut } = UseAuth();

//     useEffect(() => {
//         // Request interceptor (optional here)
//         const requestInterceptor = axiosSecure.interceptors.request.use(
//             (config) => config,
//             (error) => Promise.reject(error)
//         );

//         // Response interceptor
//         const responseInterceptor = axiosSecure.interceptors.response.use(
//             (response) => response,
//             (error) => {
                
//                 const status = error?.response?.status;
//                 console.log(status)
//                 if (status === 401) {
//                     console.warn('Unauthorized. Logging out...');
//                     logOut()
//                         .then(() => navigate('/auth/login'))
//                         .catch(() => { });
//                 } else if (status === 403) {
//                     console.warn('forbidden. Redirecting...');
//                     navigate('/forbidden');
//                 }
//                 return Promise.reject(error);
//             }
//         );

//         // Cleanup: remove interceptor when component unmounts
//         return () => {
//             axiosSecure.interceptors.request.eject(requestInterceptor);
//             axiosSecure.interceptors.response.eject(responseInterceptor);
//         };
//     }, [logOut, navigate]);

//     return axiosSecure;
// }

// export default UseAxiosSecure;


// import axios from 'axios';
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router'; // fixed import
// import UseAuth from './UseAuth';

// const axiosSecure = axios.create({
//     baseURL: 'http://localhost:3000',
// });

// function UseAxiosSecure() {
//     const navigate = useNavigate();
//     const { logOut } = UseAuth();

//     useEffect(() => {
//         // ✅ Add token to headers in each request
//         const requestInterceptor = axiosSecure.interceptors.request.use(
//             (config) => {
//                 const token = localStorage.getItem('token');
//                 if (token) {
//                     config.headers.Authorization = `Bearer ${token}`;
//                 }
//                 return config;
//             },
//             (error) => Promise.reject(error)
//         );

//         const responseInterceptor = axiosSecure.interceptors.response.use(
//             (response) => response,
//             (error) => {
//                 const status = error?.response?.status;
//                 console.log(status);
//                 if (status === 401) {
//                     console.warn('Unauthorized. Logging out...');
//                     logOut()
//                         .then(() => navigate('/auth/login'))
//                         .catch(() => { });
//                 } else if (status === 403) {
//                     console.warn('Forbidden. Redirecting...');
//                     navigate('/forbidden');
//                 }
//                 return Promise.reject(error);
//             }
//         );

//         return () => {
//             axiosSecure.interceptors.request.eject(requestInterceptor);
//             axiosSecure.interceptors.response.eject(responseInterceptor);
//         };
//     }, [logOut, navigate]);

//     return axiosSecure;
// }

// export default UseAxiosSecure;



import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router'; // make sure this is 'react-router-dom'
import UseAuth from './UseAuth'; // your custom hook

const axiosSecure = axios.create({
    baseURL: 'https://server-one-jet-28.vercel.app', // change to your deployed server when needed
});

function UseAxiosSecure() {
    const navigate = useNavigate();
    const { logOut } = UseAuth();

    useEffect(() => {
        // Request interceptor: add token to header
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token'); // ✅ consistent key
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor: handle errors globally
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error?.response?.status;

                if (status === 401) {
                    console.warn('Unauthorized. Logging out...');
                    localStorage.removeItem('access-token'); // ✅ remove token
                    logOut()
                        .then(() => {
                            navigate('/auth/login');
                        })
                        .catch(() => { });
                } else if (status === 403) {
                    console.warn('Forbidden. Redirecting...');
                    navigate('/forbidden');
                }

                return Promise.reject(error);
            }
        );

        // Cleanup interceptors on unmount
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logOut, navigate]);

    return axiosSecure;
}

export default UseAxiosSecure;
