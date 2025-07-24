import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router";
import { FaUsers, FaMoneyBillWave, FaShieldAlt, FaFileAlt } from "react-icons/fa";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const AdminDashboard = () => {
    const axiosSecure = UseAxiosSecure();

    const { data: applications = [] } = useQuery({
        queryKey: ["applications"],
        queryFn: async () => {
            const res = await axiosSecure.get("/applications");
            return res.data;
        },
    });

    const { data: users = [] } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data;
        },
    });

    const { data: policies = [] } = useQuery({
        queryKey: ["policies"],
        queryFn: async () => {
            const res = await axiosSecure.get("/policies");
            return res.data;
        },
    });

    const { data: transactions = [] } = useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            const res = await axiosSecure.get("/payment");
            return res.data;
        },
    });

    const totalIncome = transactions.reduce((sum, trx) => sum + parseFloat(trx.amount), 0);
    const chartData = transactions.map((trx) => ({
        name: trx.policename || "Unknown",
        amount: parseFloat(trx.amount) || 0,
    }));
    return (
        <motion.div
            className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Info Cards */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xl rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <FaFileAlt size={30} />
                    <h2 className="text-2xl font-bold">{applications.length}</h2>
                </div>
                <p className="mt-2">Applications</p>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-xl rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <FaUsers size={30} />
                    <h2 className="text-2xl font-bold">{users.length}</h2>
                </div>
                <p className="mt-2">Total Users</p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <FaShieldAlt size={30} />
                    <h2 className="text-2xl font-bold">{policies.length}</h2>
                </div>
                <p className="mt-2">Policies</p>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <FaMoneyBillWave size={30} />
                    <h2 className="text-2xl font-bold">${totalIncome}</h2>
                </div>
                <p className="mt-2">Total Income</p>
            </div>

            {/* Chart Section */}
         <div className="col-span-1 md:col-span-2 xl:col-span-4">
            <motion.div className="p-6 shadow-xl rounded-xl bg-white">
                <h3 className="text-xl font-bold text-center mb-4 text-indigo-700">Earnings Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#6366f1" />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>

            {/* Page Navigation */}
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <Link to="/dashboard/manage-applications">
                    <button className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">Manage Applications</button>
                </Link>
                <Link to="/dashboard/manage-user">
                    <button className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition">Manage Users</button>
                </Link>
                <Link to="/dashboard/manage-policies">
                    <button className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Manage Policies</button>
                </Link>
                <Link to="/dashboard/manage-transactions">
                    <button className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition">Manage Transactions</button>
                </Link>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
