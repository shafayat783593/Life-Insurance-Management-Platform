import React from 'react'

import { Navigate, useLocation } from 'react-router';
import UseAuth from '../../Hooks/UseAuth';
import UseUserRole from '../../Hooks/UserRole';
import Loading from '../../components/Loader/Loading';


function AgentPrivateRouters({ children }) {


    const { user, loading } = UseAuth()

    const { role, roleLoading } = UseUserRole();
    const location = useLocation(); // ✅ Fix: useLocation added

    if (loading || roleLoading) return <Loading />;

    if (!user || role !== "rider") {
        return <Navigate to="/forbiddrn" state={location.pathname} replace />;
    }


    return children
}

export default AgentPrivateRouters
