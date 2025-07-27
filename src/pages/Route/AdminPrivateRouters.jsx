import React from 'react';
import { Navigate, useLocation } from 'react-router'; // ✅ Correct import
import UseAuth from '../../Hooks/UseAuth';
import UseUserRole from '../../Hooks/UserRole';
import Loading from '../../components/Loader/Loading';


function AdminPrivateRoutes({ children }) {
    const { user, loading } = UseAuth();
    const { role, roleLoading } = UseUserRole();
    const location = useLocation(); 

    if (loading || roleLoading) return <Loading />;

    if (!user || role !== "admin") {
        return <Navigate to="/forbidden" state={location.pathname} replace />;
    }

    return children; 
}

export default AdminPrivateRoutes;
