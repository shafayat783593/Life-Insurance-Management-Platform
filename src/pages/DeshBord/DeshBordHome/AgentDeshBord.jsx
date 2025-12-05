// // src/pages/AgentDashboard.jsx
// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
// import UseAuth from "../../../Hooks/UseAuth";

// // const axiosSecure = axios.create({
// //     baseURL: "https://your-server-domain.com", // replace with actual URL
// //     withCredentials: true,
// // });

// const AgentDashboard = () => {

//     const axiosSecure = UseAxiosSecure();
//     const {user}= UseAuth()

//     const { data: agentProfile = {}, isLoading: profileLoading } = useQuery({
//         queryKey: ["agent-profile"],
//         queryFn: async () => {
//             const res = await axiosSecure.get("/users/agent/me");
//             return res.data;
//         },
//     });

//     // const agentEmail = agentProfile?.email;

//     // Only run the next queries if email is available

//     const { data: assignedCustomers = [] } = useQuery({
//         queryKey: ["assigned-customers", user.email],
//         enabled: !!user.email,
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/assigned-customers?email=${user.email}`);
//             return res.data;
//         },
//     });

//     const { data: claimRequests = [] } = useQuery({
//         queryKey: ["policy-claims", user.email],
//         enabled: !!user.email,
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/policy-claims/agent?email=${user.email}`);
//             return res.data;
//         },
//     });
  

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
//             <Card title="Assigned Customers" count={assignedCustomers?.length || 0} color="bg-blue-200" />
//             <Card title="Claim Requests" count={claimRequests?.length || 0} color="bg-rose-200" />
//             <Card title="Manage Blogs" count={agentProfile?.length || 0} color="bg-yellow-200" />
//             {/* <Card title="Policy Performance" count={policies?.length || 0} color="bg-green-200" />
//             <Card title="Recent Activities" count={activities?.length || 0} color="bg-purple-200" /> */}
//             <Card title="Agent Profile" count={user.email ? 1 : 0} color="bg-orange-200" />
//         </div>

//     );
// };

// const Card = ({ title, count, color }) => {
//     return (
//         <div
//             className={`${color} rounded-2xl p-6 shadow-md transition hover:scale-[1.02] duration-300`}
//         >
//             <h3 className="text-xl font-bold mb-2">{title}</h3>
//             <p className="text-4xl font-semibold">{count}</p>
//         </div>
//     );
// };

// export default AgentDashboard;

















// src/pages/AgentDashboard.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FaUsers,
    FaFileAlt,
    FaBlog,
    FaUserTie,
    FaChartLine,
    FaBell,
    FaArrowUp,
    FaArrowDown,
    FaSync
} from "react-icons/fa";
import { MdOutlineSecurity, MdAssignment } from "react-icons/md";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import Loading from "../../../components/Loader/Loading";
import PageTitle from "../../../Hooks/PageTItle";

const AgentDashboard = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();

    const { data: agentProfile = {}, isLoading: profileLoading } = useQuery({
        queryKey: ["agent-profile"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users/agent/me");
            return res.data;
        },
    });

    const { data: assignedCustomers = [], isLoading: customersLoading } = useQuery({
        queryKey: ["assigned-customers", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/assigned-customers?email=${user.email}`);
            return res.data;
        },
    });

    const { data: claimRequests = [], isLoading: claimsLoading } = useQuery({
        queryKey: ["policy-claims", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/policy-claims/agent?email=${user.email}`);
            return res.data;
        },
    });

    const { data: performanceStats = {} } = useQuery({
        queryKey: ["agent-performance", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/agent/performance?email=${user.email}`);
            return res.data;
        },
    });

    // Calculate statistics
    const pendingClaims = claimRequests?.filter(claim => claim.status === 'Pending')?.length || 0;
    const approvedClaims = claimRequests?.filter(claim => claim.status === 'Approved')?.length || 0;
    const activeCustomers = assignedCustomers?.filter(customer => customer.status === 'Active')?.length || 0;

    if (profileLoading || customersLoading || claimsLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <PageTitle title="Agent Dashboard" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                                <FaUserTie className="text-2xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Agent Dashboard</h1>
                                <p className="text-gray-600 mt-1">
                                    Welcome back, {agentProfile?.name || user?.displayName || 'Agent'}!
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">Online</span>
                            </div>
                            <button className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                                <FaSync className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Performance Score</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {performanceStats?.score || '85'}%
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <FaChartLine className="text-green-600 text-xl" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                                <FaArrowUp className="text-green-500 text-sm" />
                                <span className="text-green-500 text-sm font-medium">+5.2%</span>
                                <span className="text-gray-500 text-sm">this month</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Customers</p>
                                    <p className="text-2xl font-bold text-gray-800">{activeCustomers}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <FaUsers className="text-blue-600 text-xl" />
                                </div>
                            </div>
                            <div className="text-gray-500 text-sm mt-2">
                                {assignedCustomers?.length || 0} total assigned
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Claims</p>
                                    <p className="text-2xl font-bold text-gray-800">{pendingClaims}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-xl">
                                    <FaFileAlt className="text-yellow-600 text-xl" />
                                </div>
                            </div>
                            <div className="text-gray-500 text-sm mt-2">
                                {claimRequests?.length || 0} total claims
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Approval Rate</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {claimRequests?.length > 0
                                            ? Math.round((approvedClaims / claimRequests.length) * 100)
                                            : 0
                                        }%
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <MdOutlineSecurity className="text-purple-600 text-xl" />
                                </div>
                            </div>
                            <div className="text-gray-500 text-sm mt-2">
                                {approvedClaims} approved
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Assigned Customers Card */}
                    <DashboardCard
                        title="Assigned Customers"
                        count={assignedCustomers?.length || 0}
                        icon={<FaUsers className="text-2xl" />}
                        color="from-blue-500 to-blue-600"
                        description="Customers under your management"
                        trend={{ value: 12, isPositive: true }}
                        link="/agent/customers"
                    />

                    {/* Claim Requests Card */}
                    <DashboardCard
                        title="Claim Requests"
                        count={claimRequests?.length || 0}
                        icon={<FaFileAlt className="text-2xl" />}
                        color="from-rose-500 to-rose-600"
                        description="Pending policy claims to review"
                        trend={{ value: pendingClaims, isPositive: false }}
                        link="/agent/claims"
                        badge={pendingClaims > 0 ? pendingClaims : null}
                    />

                    {/* Manage Blogs Card */}
                    <DashboardCard
                        title="Manage Blogs"
                        count={agentProfile?.blogCount || 0}
                        icon={<FaBlog className="text-2xl" />}
                        color="from-amber-500 to-amber-600"
                        description="Your published blog posts"
                        trend={{ value: 3, isPositive: true }}
                        link="/agent/blogs"
                    />

                    {/* Policy Performance Card */}
                    <DashboardCard
                        title="Policy Performance"
                        count={performanceStats?.policiesSold || 0}
                        icon={<MdOutlineSecurity className="text-2xl" />}
                        color="from-emerald-500 to-emerald-600"
                        description="Policies sold this month"
                        trend={{ value: 8, isPositive: true }}
                        link="/agent/policies"
                    />

                    {/* Recent Activities Card */}
                    <DashboardCard
                        title="Recent Activities"
                        count={performanceStats?.activities || 0}
                        icon={<FaBell className="text-2xl" />}
                        color="from-purple-500 to-purple-600"
                        description="Your recent actions"
                        trend={{ value: 15, isPositive: true }}
                        link="/agent/activities"
                    />

                    {/* Agent Profile Card */}
                    <DashboardCard
                        title="Agent Profile"
                        count={1}
                        icon={<FaUserTie className="text-2xl" />}
                        color="from-orange-500 to-orange-600"
                        description="Manage your profile settings"
                        link="/profile"
                        isProfile={true}
                        profileData={{
                            name: agentProfile?.name || user?.displayName,
                            email: user?.email,
                            role: agentProfile?.role || 'Insurance Agent'
                        }}
                    />

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-2 xl:col-span-3">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MdAssignment className="text-blue-500" />
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <ActionButton
                                icon={<FaUsers />}
                                title="View Customers"
                                description="Manage assigned customers"
                                link="/dashboard/assigned-customers"
                                color="blue"
                            />
                            <ActionButton
                                icon={<FaFileAlt />}
                                title="Review Claims"
                                description="Process policy claims"
                                link="dashboard/policy-clearance"
                                color="rose"
                                badge={pendingClaims}
                            />
                            <ActionButton
                                icon={<FaBlog />}
                                title="Write Blog"
                                description="Create new blog post"
                                link="/dashboard/manage-blogs"
                                color="amber"
                            />
                            <ActionButton
                                icon={<FaChartLine />}
                                title="View Reports"
                                description="Performance analytics"
                                link="/agent/reports"
                                color="emerald"
                            />
                        </div>
                    </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {assignedCustomers?.slice(0, 3).map((customer, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FaUsers className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">New customer assigned</p>
                                    <p className="text-sm text-gray-600">{customer.name} - {customer.policy}</p>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                        ))}

                        {claimRequests?.slice(0, 2).map((claim, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                                    <FaFileAlt className="text-rose-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">New claim submitted</p>
                                    <p className="text-sm text-gray-600">{claim.policyTitle} - {claim.userEmail}</p>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced Dashboard Card Component
const DashboardCard = ({
    title,
    count,
    icon,
    color,
    description,
    trend,
    link,
    badge,
    isProfile = false,
    profileData
}) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${color} text-white`}>
                    {icon}
                </div>

                {badge && (
                    <span className="bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {badge} pending
                    </span>
                )}

                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-500' : 'text-rose-500'
                        }`}>
                        {trend.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                        <span>{trend.value}%</span>
                    </div>
                )}
            </div>

            {isProfile && profileData ? (
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {profileData.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">{profileData.name}</h3>
                            <p className="text-gray-600 text-sm">{profileData.role}</p>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm">{profileData.email}</p>
                </div>
            ) : (
                <>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-3xl font-bold text-gray-800 mb-2">{count}</p>
                    <p className="text-gray-600 text-sm mb-4">{description}</p>
                </>
            )}

            {link && (
                <a
                    href={link}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-transform duration-200"
                >
                    View Details
                    <FaArrowUp className="transform rotate-45 text-xs" />
                </a>
            )}
        </div>
    );
};

// Quick Action Button Component
const ActionButton = ({ icon, title, description, link, color, badge }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200',
        rose: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200',
        amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200',
        emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200',
        purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200',
    };

    return (
        <a
            href={link}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${colorClasses[color]}`}
        >
            <div className="p-2 bg-white rounded-lg">
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm opacity-75">{description}</p>
            </div>
            {badge && (
                <span className="bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {badge}
                </span>
            )}
        </a>
    );
};

export default AgentDashboard;