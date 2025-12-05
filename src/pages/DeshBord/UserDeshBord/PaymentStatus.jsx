// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router";
// import { FaMoneyCheckAlt } from "react-icons/fa";
// import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
// import UseAuth from "../../../Hooks/UseAuth";
// import Loading from "../../../components/Loader/Loading";
// import PageTitle from "../../../Hooks/PageTItle";

// export default function PaymentStatus() {
//     const axiosSecure = UseAxiosSecure();
//     const { user } = UseAuth();
//     const navigate = useNavigate();

//     const { data: approvedPolicies = [], isLoading } = useQuery({
//         queryKey: ['approvedPolicies', user?.email],
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/applications/approved?email=${user?.email}`);
//             return res.data;
//         },
//         enabled: !!user?.email
//     });

//     const handlePay = (id) => {
//         navigate(`/dashboard/payment/${id}`);
//     };

//     const formatCoverage = (amount) => {
//         if (amount >= 10000000) return (amount / 10000000).toFixed(2) + "কোটি";
//         if (amount >= 100000) return (amount / 100000).toFixed(2) + " লাখ";
//         if (amount >= 1000) return (amount / 1000).toFixed(2) + " হাজার";
//         return amount + " ৳";
//     };

//     if (isLoading) return <Loading/>;

//     return (
//         <div className="p-6">
//             <PageTitle title="Payment status" /> 
//             <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//                 <FaMoneyCheckAlt /> Payment Status
//             </h2>

//             {approvedPolicies.length === 0 ? (
//                 <p>No approved policies found.</p>
//             ) : (
//                 <>
//                     {/* Table for large screens */}
//                     <div className="hidden lg:block overflow-x-auto">
//                         <table className="table w-full  shadow rounded">
//                             <thead className="bg-base-200">
//                                 <tr>
//                                     <th>Policy Name</th>
//                                     <th>Coverage Amount</th>
//                                     <th>Premium Amount</th>
//                                     <th>Payment Frequency</th>
//                                     <th>Status</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {approvedPolicies.map((policy) => (
//                                     <tr key={policy._id}>
//                                         <td>{policy?.policyData?.title}</td>
//                                         <td>{formatCoverage(policy?.quote?.coverageAmount)}</td>
//                                         <td>{policy?.premiumAmount} tk</td>
//                                         <td>{policy.frequency}</td>
//                                         <td className="font-medium">{policy?.paymentStatus}</td>
//                                         <td>
//                                             {policy?.paymentStatus === "Due" && (
//                                                 <button
//                                                     className="btn btn-sm btn-success"
//                                                     onClick={() => handlePay(policy._id)}
//                                                 >
//                                                     Pay Now
//                                                 </button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Card format for small screens */}
//                     <div className="lg:hidden space-y-4">
//                         {approvedPolicies.map((policy) => (
//                             <div
//                                 key={policy._id}
//                                 className="bg-white rounded shadow-md p-4 border border-base-200"
//                             >
//                                 <h3 className="text-lg font-bold">{policy?.policyData?.title}</h3>
//                                 <p><span className="font-semibold">Coverage:</span> {formatCoverage(policy?.quote?.coverageAmount)}</p>
//                                 <p><span className="font-semibold">Premium:</span> {policy?.premiumAmount} ৳</p>
//                                 <p><span className="font-semibold">Frequency:</span> {policy.frequency}</p>
//                                 <p><span className="font-semibold">Status:</span> {policy?.paymentStatus}</p>
//                                 {policy?.paymentStatus === "Due" && (
//                                     <button
//                                         className="btn btn-sm btn-success mt-2"
//                                         onClick={() => handlePay(policy._id)}
//                                     >
//                                         Pay Now
//                                     </button>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }






















import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaMoneyCheckAlt,
    FaCreditCard,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaChartLine,
    FaFileInvoiceDollar,
    FaCalendarAlt,
    FaArrowRight
} from "react-icons/fa";
import { MdPayment, MdOutlinePaid } from "react-icons/md";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import Loading from "../../../components/Loader/Loading";
import PageTitle from "../../../Hooks/PageTItle";

export default function PaymentStatus() {
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();
    const navigate = useNavigate();

    const { data: approvedPolicies = [], isLoading } = useQuery({
        queryKey: ['approvedPolicies', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/approved?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const handlePay = (id) => {
        navigate(`/dashboard/payment/${id}`);
    };

    const formatCoverage = (amount) => {
        if (!amount) return "N/A";
        if (amount >= 10000000) return (amount / 10000000).toFixed(2) + " কোটি";
        if (amount >= 100000) return (amount / 100000).toFixed(2) + " লাখ";
        if (amount >= 1000) return (amount / 1000).toFixed(2) + " হাজার";
        return amount + " ৳";
    };

    const getPaymentStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid': return <FaCheckCircle className="text-green-500" />;
            case 'due': return <FaExclamationTriangle className="text-yellow-500" />;
            case 'pending': return <FaClock className="text-blue-500" />;
            default: return <FaClock className="text-gray-500" />;
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid': return "border-green-500 text-green-700";
            case 'due': return "border-yellow-500 text-yellow-700";
            case 'pending': return "border-blue-500 text-blue-700";
            default: return "border-gray-500 text-gray-700";
        }
    };

    if (isLoading) return <Loading />;

    // Calculate payment statistics
    const duePolicies = approvedPolicies.filter(p => p.paymentStatus?.toLowerCase() === 'due');
    const paidPolicies = approvedPolicies.filter(p => p.paymentStatus?.toLowerCase() === 'paid');
    const totalDueAmount = duePolicies.reduce((sum, policy) => sum + (policy.premiumAmount || 0), 0);

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <PageTitle title="Payment Status" />

            {/* Header with Stats */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
                    <FaMoneyCheckAlt className="text-blue-500" /> Payment Status
                </h1>
                <p className="text-gray-600 mb-6">Manage and track your policy payments</p>

                {/* Payment Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-blue-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-700">Total Policies</h3>
                                <p className="text-2xl font-bold">{approvedPolicies.length}</p>
                            </div>
                            <FaFileInvoiceDollar className="text-3xl text-blue-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-yellow-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-yellow-700">Pending Payments</h3>
                                <p className="text-2xl font-bold">{duePolicies.length}</p>
                            </div>
                            <FaExclamationTriangle className="text-3xl text-yellow-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-green-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-green-700">Total Paid</h3>
                                <p className="text-2xl font-bold">{paidPolicies.length}</p>
                            </div>
                            <MdOutlinePaid className="text-3xl text-green-500" />
                        </div>
                    </motion.div>
                </div>

                {/* Total Due Amount Banner */}
                {totalDueAmount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 rounded-xl border-2 border-yellow-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-700">Total Amount Due</h3>
                                <p className="text-3xl font-bold text-yellow-600">{formatCoverage(totalDueAmount)}</p>
                                <p className="text-sm text-gray-600 mt-1">{duePolicies.length} policy(s) pending payment</p>
                            </div>
                            <FaChartLine className="text-4xl text-yellow-500" />
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Policies List */}
            {approvedPolicies.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="text-5xl mb-4">💳</div>
                    <h3 className="text-xl font-semibold mb-2">No Approved Policies</h3>
                    <p className="text-gray-600">You don't have any approved policies requiring payment.</p>
                </motion.div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto rounded-xl border-2 border-gray-200 shadow-lg">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-300">
                                    <th className="font-bold text-gray-700">Policy Details</th>
                                    <th className="font-bold text-gray-700">Coverage</th>
                                    <th className="font-bold text-gray-700">Premium</th>
                                    <th className="font-bold text-gray-700">Frequency</th>
                                    <th className="font-bold text-gray-700">Payment Status</th>
                                    <th className="font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {approvedPolicies.map((policy, index) => (
                                        <motion.tr
                                            key={policy._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{
                                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                                borderLeft: "4px solid #3b82f6"
                                            }}
                                            className="border-b border-gray-100 group"
                                        >
                                            <td>
                                                <div className="font-semibold">{policy?.policyData?.title}</div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Policy ID: <span className="font-mono">{policy._id.slice(-8)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-bold text-lg">{formatCoverage(policy?.quote?.coverageAmount)}</div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xl text-green-600">{policy?.premiumAmount} ৳</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-blue-500" />
                                                    <span className="font-semibold">{policy.frequency || "Monthly"}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 ${getPaymentStatusColor(policy.paymentStatus)}`}>
                                                    {getPaymentStatusIcon(policy.paymentStatus)}
                                                    <span className="font-semibold">{policy.paymentStatus}</span>
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    {policy.paymentStatus?.toLowerCase() === "due" && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handlePay(policy._id)}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-green-500 text-green-600 hover:shadow-lg transition-all group-hover:border-green-600 group-hover:text-green-700"
                                                        >
                                                            <MdPayment /> Pay Now
                                                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                                        </motion.button>
                                                    )}
                                                    {policy.paymentStatus?.toLowerCase() === "paid" && (
                                                        <span className="flex items-center gap-2 px-3 py-2 text-green-600 font-semibold">
                                                            <FaCheckCircle /> Paid
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                        <AnimatePresence>
                            {approvedPolicies.map((policy, index) => (
                                <motion.div
                                    key={policy._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="rounded-xl border-2 border-gray-200 shadow-lg p-4 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg">{policy?.policyData?.title}</h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                ID: <span className="font-mono">{policy._id.slice(-6)}</span>
                                            </p>
                                        </div>
                                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full border-2 ${getPaymentStatusColor(policy.paymentStatus)}`}>
                                            {getPaymentStatusIcon(policy.paymentStatus)}
                                            <span className="text-sm font-semibold">{policy.paymentStatus}</span>
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-3 rounded-lg border border-gray-200">
                                            <div className="text-sm font-semibold text-gray-600">Coverage</div>
                                            <div className="font-bold">{formatCoverage(policy?.quote?.coverageAmount)}</div>
                                        </div>
                                        <div className="text-center p-3 rounded-lg border border-gray-200">
                                            <div className="text-sm font-semibold text-gray-600">Premium</div>
                                            <div className="font-bold text-green-600">{policy?.premiumAmount} ৳</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-blue-500" />
                                            <span className="font-semibold">Frequency:</span>
                                        </div>
                                        <span className="font-bold">{policy.frequency || "Monthly"}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        {policy.paymentStatus?.toLowerCase() === "due" && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handlePay(policy._id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-green-500 text-green-600 hover:shadow-lg transition-shadow"
                                            >
                                                <FaCreditCard /> Pay Now
                                            </motion.button>
                                        )}
                                        {policy.paymentStatus?.toLowerCase() === "paid" && (
                                            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-green-500 text-green-600">
                                                <FaCheckCircle /> Payment Completed
                                            </div>
                                        )}

                                        {policy.paymentStatus?.toLowerCase() !== "due" && policy.paymentStatus?.toLowerCase() !== "paid" && (
                                            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-blue-500 text-blue-600">
                                                <FaClock /> {policy.paymentStatus}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}

            {/* Payment Information Section */}
            {duePolicies.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 p-4 rounded-xl border-2 border-blue-500 shadow-lg"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full border-2 border-blue-500">
                            <FaCreditCard className="text-2xl text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">Payment Instructions</h3>
                            <ul className="text-gray-600 space-y-1">
                                <li>• Click "Pay Now" to proceed with payment</li>
                                <li>• You will be redirected to our secure payment gateway</li>
                                <li>• Payments are processed in real-time</li>
                                <li>• Once paid, your policy status will update automatically</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}