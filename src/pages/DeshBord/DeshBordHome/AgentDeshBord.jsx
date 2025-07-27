// src/pages/AgentDashboard.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const axiosSecure = axios.create({
    baseURL: "https://your-server-domain.com", // replace with actual URL
    withCredentials: true,
});

const AgentDashboard = () => {
    const { data: agentProfile = {} } = useQuery({
        queryKey: ["agent-profile"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users/agent/me");
            return res.data;
        },
    });

    const { data: assignedCustomers = [] } = useQuery({
        queryKey: ["assigned-customers"],
        queryFn: async () => {
            const res = await axiosSecure.get("/assigned-customers");
            return res.data;
        },
    });

    const { data: claimRequests = [] } = useQuery({
        queryKey: ["policy-claims"],
        queryFn: async () => {
            const res = await axiosSecure.get("/policy-claims/agent");
            return res.data;
        },
    });

    const { data: blogs = [] } = useQuery({
        queryKey: ["agent-blogs"],
        queryFn: async () => {
            const res = await axiosSecure.get("/blogs/agent");
            return res.data;
        },
    });

    const { data: policies = [] } = useQuery({
        queryKey: ["policy-performance"],
        queryFn: async () => {
            const res = await axiosSecure.get("/policies/performance");
            return res.data;
        },
    });

    const { data: activities = [] } = useQuery({
        queryKey: ["agent-activities"],
        queryFn: async () => {
            const res = await axiosSecure.get("/agent/activities");
            return res.data;
        },
    });

    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
            <Card title="Assigned Customers" count={assignedCustomers.length} color="bg-blue-200" />
            <Card title="Claim Requests" count={claimRequests.length} color="bg-rose-200" />
            <Card title="Manage Blogs" count={blogs.length} color="bg-yellow-200" />
            <Card title="Policy Performance" count={policies.length} color="bg-green-200" />
            <Card title="Recent Activities" count={activities.length} color="bg-purple-200" />
            <Card title="Agent Profile" count={1} color="bg-orange-200" />
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
