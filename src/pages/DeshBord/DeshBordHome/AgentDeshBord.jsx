// src/pages/AgentDashboard.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";

// const axiosSecure = axios.create({
//     baseURL: "https://your-server-domain.com", // replace with actual URL
//     withCredentials: true,
// });

const AgentDashboard = () => {

    const axiosSecure = UseAxiosSecure();
    const {user}= UseAuth()

    const { data: agentProfile = {}, isLoading: profileLoading } = useQuery({
        queryKey: ["agent-profile"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users/agent/me");
            return res.data;
        },
    });

    // const agentEmail = agentProfile?.email;

    // Only run the next queries if email is available

    const { data: assignedCustomers = [] } = useQuery({
        queryKey: ["assigned-customers", user.email],
        enabled: !!user.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/assigned-customers?email=${user.email}`);
            return res.data;
        },
    });

    const { data: claimRequests = [] } = useQuery({
        queryKey: ["policy-claims", user.email],
        enabled: !!user.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/policy-claims/agent?email=${user.email}`);
            return res.data;
        },
    });
  

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
            <Card title="Assigned Customers" count={assignedCustomers?.length || 0} color="bg-blue-200" />
            <Card title="Claim Requests" count={claimRequests?.length || 0} color="bg-rose-200" />
            <Card title="Manage Blogs" count={agentProfile?.length || 0} color="bg-yellow-200" />
            {/* <Card title="Policy Performance" count={policies?.length || 0} color="bg-green-200" />
            <Card title="Recent Activities" count={activities?.length || 0} color="bg-purple-200" /> */}
            <Card title="Agent Profile" count={user.email ? 1 : 0} color="bg-orange-200" />
        </div>

    );
};

const Card = ({ title, count, color }) => {
    return (
        <div
            className={`${color} rounded-2xl p-6 shadow-md transition hover:scale-[1.02] duration-300`}
        >
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-4xl font-semibold">{count}</p>
        </div>
    );
};

export default AgentDashboard;
