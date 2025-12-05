import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import {
    FaMoneyBillWave,
    FaCalendarAlt,
    FaShieldAlt,
    FaDownload,
    FaSearch,
    FaSync,
    FaChartLine
} from "react-icons/fa";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import PageTitle from "../../Hooks/PageTItle";
import Loading from "../../components/Loader/Loading";

const ManageTransactions = () => {
    const axiosSecure = UseAxiosSecure();
    const [darkMode, setDarkMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Dark mode implementation
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        if (darkMode) {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    // Fetch transactions data
    const { data: transactions = [], isLoading, refetch } = useQuery({
        queryKey: ["all-transactions"],
        queryFn: async () => {
            const res = await axiosSecure.get("/payment");
            return res.data;
        },
    });

    // Calculate statistics
    const totalIncome = transactions.reduce((acc, item) => acc + (item.amount || 0), 0);
    const formattedIncome = new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT'
    }).format(totalIncome);

    const successfulPayments = transactions.filter(item => item.paymentStatus === 'success').length;
    const pendingPayments = transactions.filter(item => item.paymentStatus === 'pending').length;

    // Filter transactions
    const filteredTransactions = transactions.filter(item => {
        const matchesSearch =
            item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.policename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = dateFilter === "all" || true;
        const matchesStatus = statusFilter === "all" || item.paymentStatus === statusFilter;

        return matchesSearch && matchesDate && matchesStatus;
    });

    // Chart data
    const chartData = transactions.map((item) => ({
        name: `T${item.transactionId?.slice(-4) || '0000'}`,
        amount: item.amount || 0,
        date: new Date(item.date).toLocaleDateString(),
    })).slice(-10);

    if (isLoading) return <Loading />;

    return (
        <>
            <PageTitle title="Manage Transactions" />

            <div className="min-h-screen bg-base-100 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary text-primary-content rounded-xl shadow-lg">
                                    <FaMoneyBillWave className="text-2xl" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-base-content">Manage Transactions</h1>
                                    <p className="text-base-content/70 mt-1">
                                        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleDarkMode}
                                    className="btn btn-ghost btn-circle"
                                >
                                    {darkMode ? '☀️' : '🌙'}
                                </button>
                                <button
                                    onClick={() => refetch()}
                                    className="btn btn-outline gap-2"
                                >
                                    <FaSync />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="card bg-base-100 shadow-sm border">
                                <div className="card-body">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-success/20 text-success rounded-lg">
                                            <FaMoneyBillWave className="text-lg" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-base-content/70">Total Income</p>
                                            <p className="text-2xl font-bold text-base-content">{formattedIncome}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-sm border">
                                <div className="card-body">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                            <FaMoneyBillWave className="text-lg" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-base-content/70">Total Transactions</p>
                                            <p className="text-2xl font-bold text-base-content">{transactions.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-sm border">
                                <div className="card-body">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-info/20 text-info rounded-lg">
                                            <FaChartLine className="text-lg" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-base-content/70">Successful</p>
                                            <p className="text-2xl font-bold text-base-content">{successfulPayments}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-sm border">
                                <div className="card-body">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-warning/20 text-warning rounded-lg">
                                            <FaCalendarAlt className="text-lg" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-base-content/70">Pending</p>
                                            <p className="text-2xl font-bold text-base-content">{pendingPayments}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter Bar */}
                        <div className="card bg-base-100 shadow-sm border">
                            <div className="card-body">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                                        <input
                                            type="text"
                                            placeholder="Search transactions by email, policy, or transaction ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="input input-bordered w-full pl-10 pr-4"
                                        />
                                    </div>

                                    <select
                                        className="select select-bordered"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="success">Success</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                    </select>

                                    <select
                                        className="select select-bordered"
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                    >
                                        <option value="all">All Time</option>
                                        <option value="today">Today</option>
                                        <option value="week">This Week</option>
                                        <option value="month">This Month</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                        {/* Transactions Table */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="xl:col-span-2 card bg-base-100 shadow-sm border"
                        >
                            <div className="card-body p-0">
                                <div className="p-6 border-b">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
                                            <FaMoneyBillWave className="text-primary" />
                                            Recent Transactions
                                        </h3>
                                        <button className="btn btn-primary gap-2">
                                            <FaDownload />
                                            Export
                                        </button>
                                    </div>
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block">
                                    <div className="overflow-x-auto">
                                        <table className="table table-zebra">
                                            <thead>
                                                <tr>
                                                    <th className="text-base-content">Transaction</th>
                                                    <th className="text-base-content">User</th>
                                                    <th className="text-base-content">Policy</th>
                                                    <th className="text-base-content">Amount</th>
                                                    <th className="text-base-content">Date</th>
                                                    <th className="text-base-content">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredTransactions.slice(0, 8).map((item) => (
                                                    <tr key={item._id}>
                                                        <td>
                                                            <div>
                                                                <p className="font-mono text-sm text-base-content">
                                                                    {item.transactionId?.slice(0, 8)}...
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <p className="text-sm text-base-content/70">{item.email}</p>
                                                        </td>
                                                        <td>
                                                            <p className="font-medium text-base-content">{item.policename}</p>
                                                        </td>
                                                        <td>
                                                            <p className="font-bold text-base-content">
                                                                ৳{item.amount?.toLocaleString()}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                                                <FaCalendarAlt />
                                                                {new Date(item.date).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge badge-lg ${item.paymentStatus === 'success'
                                                                    ? 'badge-success'
                                                                    : item.paymentStatus === 'pending'
                                                                        ? 'badge-warning'
                                                                        : 'badge-error'
                                                                }`}>
                                                                {item.paymentStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden space-4 p-6">
                                    {filteredTransactions.slice(0, 6).map((item) => (
                                        <div key={item._id} className="card bg-base-200 shadow-sm border mb-4">
                                            <div className="card-body">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="font-mono text-sm text-base-content">
                                                            {item.transactionId?.slice(0, 12)}...
                                                        </p>
                                                        <p className="text-sm text-base-content/70">{item.email}</p>
                                                    </div>
                                                    <span className={`badge ${item.paymentStatus === 'success'
                                                            ? 'badge-success'
                                                            : item.paymentStatus === 'pending'
                                                                ? 'badge-warning'
                                                                : 'badge-error'
                                                        }`}>
                                                        {item.paymentStatus}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <FaShieldAlt className="text-base-content/50" />
                                                        <span className="text-base-content/70">{item.policename}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaMoneyBillWave className="text-base-content/50" />
                                                        <span className="font-bold text-base-content">৳{item.amount?.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-base-content/50" />
                                                        <span className="text-base-content/70">{new Date(item.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Earnings Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="card bg-base-100 shadow-sm border"
                        >
                            <div className="card-body">
                                <h3 className="text-xl font-bold text-base-content mb-6 flex items-center gap-2">
                                    <FaChartLine className="text-primary" />
                                    Revenue Analytics
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis
                                            dataKey="name"
                                            className="text-sm"
                                        />
                                        <YAxis
                                            tickFormatter={(value) => `৳${value}`}
                                            className="text-sm"
                                        />
                                        <Tooltip
                                            formatter={(value) => [`৳${value}`, 'Amount']}
                                            className="bg-base-200 text-base-content"
                                        />
                                        <Bar
                                            dataKey="amount"
                                            className="fill-primary"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageTransactions;