import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import PageTitle from "../../Hooks/PageTItle";

const ManageTransactions = () => {
    const axiosSecure = UseAxiosSecure();

    const { data: transactions = [] } = useQuery({
        queryKey: ["all-transactions"],
        queryFn: async () => {
            const res = await axiosSecure.get("/payment");
            return res.data;
        },
    });

    const totalIncome = transactions.reduce((acc, item) => acc + item.amount, 0);
    const formattedIncome = totalIncome.toFixed(2); 

    const chartData = transactions.map((item) => ({
        name: new Date(item.date).toLocaleDateString(),
        amount: item.amount,
    }));

    return (
        <>
            <PageTitle title="Manage Transaction" /> 
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto p-4"
        >
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
                Manage Transactions
            </h2>

            {/* Total Income */}
            <div className="mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-md p-6 text-center">
                <h3 className="text-xl font-semibold">Total Income</h3>
                    <p className="text-4xl font-bold">{formattedIncome} tk</p>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-6">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow">
                    Filter by Date
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg shadow">
                    Filter by User
                </button>
                <button className="bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg shadow">
                    Filter by Policy
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto mb-8">
                <table className="table w-full">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th>Transaction ID</th>
                            <th>Email</th>
                            <th>Policy Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-100">
                                <td>{item.transactionId}</td>
                                <td>{item.email}</td>
                                <td>{item.policename}</td>
                                <td>{item.amount} tk</td>
                                <td>{new Date(item.date).toLocaleString()}</td>
                                <td>
                                    <span className="badge badge-success">{item.paymentStatus}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 mb-8">
                {transactions.map((item) => (
                    <div key={item._id} className="bg-white p-4 rounded-xl shadow border">
                        <p><span className="font-bold text-indigo-600">Transaction ID:</span> {item.transactionId}</p>
                        <p><span className="font-bold text-indigo-600">Email:</span> {item.email}</p>
                        <p><span className="font-bold text-indigo-600">Policy:</span> {item.policename}</p>
                        <p><span className="font-bold text-indigo-600">Amount:</span> ${item.amount}</p>
                        <p><span className="font-bold text-indigo-600">Date:</span> {new Date(item.date).toLocaleString()}</p>
                        <p>
                            <span className="font-bold text-indigo-600">Status:</span>
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-sm">{item.paymentStatus}</span>
                        </p>
                    </div>
                ))}
            </div>

            {/* Earnings Chart */}
            <div className="p-6 shadow-xl rounded-xl bg-white">
                <h3 className="text-xl font-bold text-center mb-4 text-indigo-700">Earnings Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#6366f1" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
        </>
    );
};

export default ManageTransactions;
