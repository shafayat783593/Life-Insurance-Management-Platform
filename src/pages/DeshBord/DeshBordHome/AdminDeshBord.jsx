import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    CartesianGrid
} from "recharts";
import { Link } from "react-router";
import {
    FaUsers,
    FaMoneyBillWave,
    FaShieldAlt,
    FaFileAlt,
    FaChartLine,
    FaArrowUp,
    FaArrowDown,
    FaEye,
    FaSync,
    FaUserCog,
    FaCog,
    FaMoon,
    FaSun
} from "react-icons/fa";
import { MdDashboard, MdPayments, MdSecurity } from "react-icons/md";
import { useState, useEffect } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import PageTitle from "../../../Hooks/PageTItle";
import Loading from "../../../components/Loader/Loading";

const AdminDashboard = () => {
    const axiosSecure = UseAxiosSecure();
    const [darkMode, setDarkMode] = useState(false);

    // Check system preference and saved theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const { data: applications = [], isLoading: appsLoading } = useQuery({
        queryKey: ["applications"],
        queryFn: async () => {
            const res = await axiosSecure.get("/applications");
            return res.data;
        },
    });

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data;
        },
    });

    const { data: policies = [], isLoading: policiesLoading } = useQuery({
        queryKey: ["policies"],
        queryFn: async () => {
            const res = await axiosSecure.get("/policies");
            return res.data;
        },
    });

    const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            const res = await axiosSecure.get("/payment");
            return res.data;
        },
    });

    // Calculate statistics
    const totalIncome = transactions.reduce((sum, trx) => sum + parseFloat(trx.amount || 0), 0);
    const formattedIncome = new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT'
    }).format(totalIncome);

    const pendingApplications = applications.filter(app => app.status === 'Pending').length;
    const approvedApplications = applications.filter(app => app.status === 'Approved').length;

    const adminUsers = users.filter(user => user.role === 'admin').length;
    const agentUsers = users.filter(user => user.role === 'agent').length;
    const customerUsers = users.filter(user => user.role === 'user').length;

    // Chart Data
    const earningsData = transactions.map((trx, index) => ({
        name: `T${index + 1}`,
        amount: parseFloat(trx.amount) || 0,
        date: trx.date || new Date().toISOString().split('T')[0]
    })).slice(-8);

    const applicationStatusData = [
        { name: 'Approved', value: approvedApplications, color: '#10B981' },
        { name: 'Pending', value: pendingApplications, color: '#F59E0B' },
        { name: 'Rejected', value: applications.filter(app => app.status === 'Rejected').length, color: '#EF4444' }
    ];

    const userDistributionData = [
        { name: 'Customers', value: customerUsers, color: '#3B82F6' },
        { name: 'Agents', value: agentUsers, color: '#8B5CF6' },
        { name: 'Admins', value: adminUsers, color: '#06B6D4' }
    ];

    // Recent activities
    const recentActivities = [
        ...applications.slice(-3).map(app => ({
            type: 'application',
            message: `New application from ${app.name}`,
            time: '2 mins ago',
            icon: FaFileAlt,
            color: 'blue'
        })),
        ...transactions.slice(-2).map(trx => ({
            type: 'payment',
            message: `Payment received: ৳${trx.amount}`,
            time: '5 mins ago',
            icon: FaMoneyBillWave,
            color: 'green'
        }))
    ];

    const isLoading = appsLoading || usersLoading || policiesLoading || transactionsLoading;

    if (isLoading) return <Loading />;

    // Chart style based on dark mode
    const chartTextColor = darkMode ? '#D1D5DB' : '#6B7280';
    const chartGridColor = darkMode ? '#374151' : '#f0f0f0';
    const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
    const cardBorder = darkMode ? 'border-gray-700' : 'border-gray-200';
    const textPrimary = darkMode ? 'text-white' : 'text-gray-800';
    const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
    const bgGradient = darkMode
        ? 'from-gray-900 to-gray-800'
        : 'from-gray-50 to-gray-100';

    return (
        <>
            <PageTitle title="Admin Dashboard" />

            <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-4 md:p-6 transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                                    <MdDashboard className="text-2xl text-white" />
                                </div>
                                <div>
                                    <h1 className={`text-3xl font-bold ${textPrimary}`}>Admin Dashboard</h1>
                                    <p className={`${textSecondary} mt-1`}>
                                        Overview of your insurance platform
                                    </p>
                                </div>
                            </div>

                          
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <StatCard
                                title="Total Applications"
                                value={applications.length}
                                change={12}
                                isPositive={true}
                                icon={FaFileAlt}
                                color="indigo"
                                link="/dashboard/manage-applications"
                                darkMode={darkMode}
                            />
                            <StatCard
                                title="Total Users"
                                value={users.length}
                                change={8}
                                isPositive={true}
                                icon={FaUsers}
                                color="blue"
                                link="/dashboard/manage-user"
                                darkMode={darkMode}
                            />
                            <StatCard
                                title="Active Policies"
                                value={policies.length}
                                change={5}
                                isPositive={true}
                                icon={FaShieldAlt}
                                color="emerald"
                                link="/dashboard/manage-policies"
                                darkMode={darkMode}
                            />
                            <StatCard
                                title="Total Revenue"
                                value={formattedIncome}
                                change={15}
                                isPositive={true}
                                icon={FaMoneyBillWave}
                                color="amber"
                                link="/dashboard/manage-transaction"
                                darkMode={darkMode}
                            />
                        </div>
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                        {/* Earnings Chart */}
                        <motion.div
                            className={`xl:col-span-2 ${cardBg} ${cardBorder} rounded-2xl p-6 shadow-sm border transition-colors duration-300`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-xl font-bold ${textPrimary} flex items-center gap-2`}>
                                    <FaChartLine className="text-indigo-500" />
                                    Revenue Analytics
                                </h3>
                                <select className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300 ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border-gray-300 text-gray-800'
                                    }`}>
                                    <option>Last 7 days</option>
                                    <option>Last 30 days</option>
                                    <option>Last 90 days</option>
                                </select>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={earningsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: chartTextColor }}
                                        axisLine={{ stroke: chartGridColor }}
                                    />
                                    <YAxis
                                        tick={{ fill: chartTextColor }}
                                        axisLine={{ stroke: chartGridColor }}
                                        tickFormatter={(value) => `৳${value}`}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`৳${value}`, 'Amount']}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                            color: darkMode ? '#FFFFFF' : '#000000',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Bar
                                        dataKey="amount"
                                        fill="url(#colorGradient)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366F1" />
                                            <stop offset="100%" stopColor="#8B5CF6" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Application Status */}
                        <motion.div
                            className={`${cardBg} ${cardBorder} rounded-2xl p-6 shadow-sm border transition-colors duration-300`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <h3 className={`text-xl font-bold ${textPrimary} mb-6 flex items-center gap-2`}>
                                <FaFileAlt className="text-green-500" />
                                Application Status
                            </h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={applicationStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {applicationStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                            color: darkMode ? '#FFFFFF' : '#000000',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {applicationStatusData.map((status, index) => (
                                    <div key={index} className="text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: status.color }}
                                            ></div>
                                            <span className={`text-sm font-medium ${textPrimary}`}>{status.name}</span>
                                        </div>
                                        <p className={`text-2xl font-bold ${textPrimary}`}>{status.value}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* User Distribution */}
                        <motion.div
                            className={`${cardBg} ${cardBorder} rounded-2xl p-6 shadow-sm border transition-colors duration-300`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className={`text-xl font-bold ${textPrimary} mb-6 flex items-center gap-2`}>
                                <FaUsers className="text-blue-500" />
                                User Distribution
                            </h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={userDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {userDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                            color: darkMode ? '#FFFFFF' : '#000000',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-3 mt-4">
                                {userDistributionData.map((userType, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: userType.color }}
                                            ></div>
                                            <span className={`text-sm ${textSecondary}`}>{userType.name}</span>
                                        </div>
                                        <span className={`font-semibold ${textPrimary}`}>{userType.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recent Activities */}
                        <motion.div
                            className={`lg:col-span-2 ${cardBg} ${cardBorder} rounded-2xl p-6 shadow-sm border transition-colors duration-300`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <h3 className={`text-xl font-bold ${textPrimary} mb-6 flex items-center gap-2`}>
                                <FaEye className="text-purple-500" />
                                Recent Activities
                            </h3>
                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className={`flex items-center gap-4 p-3 rounded-xl transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                        }`}>
                                        <div className={`p-2 rounded-lg ${activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                                activity.color === 'green' ? 'bg-green-100 text-green-600' :
                                                    darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            <activity.icon />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-medium ${textPrimary}`}>{activity.message}</p>
                                            <p className={`text-sm ${textSecondary}`}>{activity.time}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.type === 'application'
                                                ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                                                : darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {activity.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        className={`${cardBg} ${cardBorder} rounded-2xl p-6 shadow-sm border transition-colors duration-300`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <h3 className={`text-xl font-bold ${textPrimary} mb-6 flex items-center gap-2`}>
                            <FaCog className="" />
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <ActionButton
                                icon={<FaFileAlt />}
                                title="Applications"
                                description="Manage all applications"
                                link="/dashboard/manage-applications"
                                color="indigo"
                                count={applications.length}
                                // darkMode={darkMode}
                            />
                            <ActionButton
                                icon={<FaUserCog />}
                                title="Users"
                                description="Manage platform users"
                                link="/dashboard/manage-user"
                                color="blue"
                                count={users.length}
                                // darkMode={darkMode}
                            />
                            <ActionButton
                                icon={<MdSecurity />}
                                title="Policies"
                                description="Manage insurance policies"
                                link="/dashboard/manage-policies"
                                color="emerald"
                                count={policies.length}
                                // darkMode={darkMode}
                            />
                            <ActionButton
                                icon={<MdPayments />}
                                title="Transactions"
                                description="View payment history"
                                link="/dashboard/manage-transaction"
                                color="amber"
                                count={transactions.length}
                                // darkMode={darkMode}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

// Stat Card Component
const StatCard = ({ title, value, change, isPositive, icon: Icon, color, link, darkMode }) => {
    const colorClasses = {
        indigo: 'from-indigo-500 to-purple-600',
        blue: 'from-blue-500 to-cyan-600',
        emerald: 'from-emerald-500 to-green-600',
        amber: 'from-amber-500 to-orange-600',
        rose: 'from-rose-500 to-pink-600'
    };

    return (
        <motion.div
            className={`bg-gradient-to-r ${colorClasses[color]} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-3  bg-opacity-20 rounded-xl">
                    <Icon className="text-2xl" />
                </div>
                <div className="flex items-center gap-1 bg-opacity-20 px-2 py-1 rounded-full">
                    {isPositive ? <FaArrowUp className="text-sm" /> : <FaArrowDown className="text-sm" />}
                    <span className="text-sm font-medium">{change}%</span>
                </div>
            </div>

            <h3 className="text-2xl font-bold mb-2">{value}</h3>
            <p className="text-white text-opacity-90">{title}</p>

            {link && (
                <Link to={link} className="block mt-4">
                    <button className="w-full border-2 cursor-pointer bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 rounded-xl transition-all duration-200">
                        View Details
                    </button>
                </Link>
            )}
        </motion.div>
    );
};

// Action Button Component
const ActionButton = ({ icon, title, description, link, color, count, darkMode }) => {
    const colorClasses = {
        indigo: darkMode
            ? 'bg-indigo-900 text-indigo-200 border-indigo-700 hover:bg-indigo-800'
            : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100',
        blue: darkMode
            ? 'bg-blue-900 text-blue-200 border-blue-700 hover:bg-blue-800'
            : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
        emerald: darkMode
            ? 'bg-emerald-900 text-emerald-200 border-emerald-700 hover:bg-emerald-800'
            : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
        amber: darkMode
            ? 'bg-amber-900 text-amber-200 border-amber-700 hover:bg-amber-800'
            : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
    };

    const countBg = darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-800';

    return (
        <Link to={link}>
            <motion.div
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${colorClasses[color]} hover:scale-105 hover:shadow-md`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className={`p-3 rounded-lg shadow-sm ${darkMode ? 'bg-gray-700' : 'bg-white'
                    }`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold">{title}</h4>
                    <p className="text-sm opacity-75">{description}</p>
                </div>
                {count !== undefined && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${countBg}`}>
                        {count}
                    </span>
                )}
            </motion.div>
        </Link>
    );
};

export default AdminDashboard;