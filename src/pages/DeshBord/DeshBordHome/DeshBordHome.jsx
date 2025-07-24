import React from 'react'
import UseUserRole from '../../../Hooks/UserRole'
import Loading from '../../../components/Loader/Loading'
import AdminDeshBord from './AdminDeshBord'
import Forbidden from '../../Forbidden'
import AgentDashboard from './AgentDeshBord'
import CustomerDashboard from './CostomerDeshBord'

function DeshBordHome() {
    const { role, roleLoading } = UseUserRole()
    if (roleLoading) {
        return <Loading />
    }
    if (role === "customer"){
        return <CustomerDashboard/>
    }
    else if (role === "agent"){
        return <AgentDashboard/>
    }
    else if (role === "admin"){
        return <AdminDeshBord/>
    }
   else{
    return <Forbidden/>
   }
}

export default DeshBordHome
