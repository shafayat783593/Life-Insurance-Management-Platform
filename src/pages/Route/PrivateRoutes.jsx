import React from 'react'
import UseAuth from '../../Hooks/UseAuth'
import { Navigate, useLocation } from 'react-router'
import Loading from '../../components/Loader/Loading'

function PrivateRoutes({ children }) {
    const location = useLocation()

    const { user, loading } = UseAuth()
    if (loading) {
        return <Loading />
    }

    if (user && user?.email) {
        return children
    }



    return <Navigate state={location.pathname} to="/auth/login" />
}

export default PrivateRoutes
