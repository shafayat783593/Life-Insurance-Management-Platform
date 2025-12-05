import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave, } from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../../components/Loader/Loading';
import { useNavigate } from 'react-router';
import { BaggageClaim } from 'lucide-react';

const MyPolicies = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();

    const { data: myPolicies = [], isLoading } = useQuery({
        queryKey: ['myPolicies', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-policies?email=${user.email}`);
            return res.data;
        },
    });

    console.log(myPolicies);

    const handlePay = (policyId) => {
        console.log('Paying for:', policyId);
        navigate("/dashboard/payment-status");
    };

    const handleClaim = (policyId) => {
        console.log('Claiming policy:', policyId);
        navigate("/dashboard/claim-request");
    };

    if (isLoading) return <Loading />;

    const approvedPolicies = myPolicies.filter(p => p.status === 'Approved');
    const rejectedPolicies = myPolicies.filter(p => p.status === 'Rejected');
    const pendingPolicies = myPolicies.filter(p => p.status === 'Pending');

    return (
        <div className="px-4 md:px-8 py-6">
            <h2 className="text-3xl font-bold mb-8 text-center">My Policies</h2>

            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl border-2 border-green-500 shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-green-700">Approved</h3>
                            <p className="text-2xl font-bold">{approvedPolicies.length}</p>
                        </div>
                        <FaCheckCircle className="text-4xl text-green-500" />
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl border-2 border-yellow-500 shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-700">Pending</h3>
                            <p className="text-2xl font-bold">{pendingPolicies.length}</p>
                        </div>
                        <MdPendingActions className="text-4xl text-yellow-500" />
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl border-2 border-red-500 shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-red-700">Rejected</h3>
                            <p className="text-2xl font-bold">{rejectedPolicies.length}</p>
                        </div>
                        <FaTimesCircle className="text-4xl text-red-500" />
                    </div>
                </motion.div>
            </div>

            {/* Pending Policies Section */}
            {pendingPolicies.length > 0 && (
                <section className="mb-10">
                    <h3 className="text-2xl font-semibold text-yellow-600 mb-4 flex items-center gap-2">
                        <MdPendingActions /> Pending Review
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingPolicies.map(policy => (
                            <motion.div
                                key={policy._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="border-2 border-yellow-300 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-lg font-bold">{policy.policyData?.title}</h4>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        Under Review
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p>Premium: <strong>{policy.premiumAmount} tk</strong></p>
                                    <p>Agent: <strong>{policy.assignedAgent || "Not assigned yet"}</strong></p>
                                    <p>Submitted: {new Date(policy.submittedAt).toLocaleDateString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Approved Policies Section */}
            <section className="mb-10">
                <h3 className="text-2xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                    <FaCheckCircle /> Approved Policies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedPolicies.map(policy => (
                        <motion.div
                            key={policy._id}
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="border-2 border-green-500 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-lg font-bold">{policy.policyData?.title}</h4>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${policy.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {policy.paymentStatus}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <p>Premium: <strong>{policy.premiumAmount} tk</strong></p>
                                <p>Agent: <strong>{policy.assignedAgent || "N/A"}</strong></p>
                                <p>Coverage: {policy.policyData?.coverageAmount || "N/A"}</p>
                                <p>Policy No: <code className="bg-gray-100 px-2 py-1 rounded">{policy._id.slice(-8)}</code></p>
                            </div>

                            <div className="flex gap-2">
                                {policy.paymentStatus === "Due" ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handlePay(policy._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all w-full justify-center"
                                    >
                                        <FaMoneyBillWave /> Pay Now
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleClaim(policy._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all w-full justify-center"
                                    >
                                            <BaggageClaim /> Claim Request
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Rejected Policies Section */}
            {rejectedPolicies.length > 0 && (
                <section>
                    <h3 className="text-2xl font-semibold text-red-500 mb-4 flex items-center gap-2">
                        <FaTimesCircle /> Rejected Policies
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rejectedPolicies.map(policy => (
                            <motion.div
                                key={policy._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="border-2 border-red-400 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-lg font-bold text-red-700">{policy.policyData?.title}</h4>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                        Rejected
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-3 rounded-lg border border-red-200">
                                        <p className="font-semibold text-red-700 mb-1">Reason for Rejection:</p>
                                        <p className="text-gray-700">{policy.rejectionFeedback || 'Not specified'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="font-semibold">Premium:</p>
                                            <p>{policy.premiumAmount || 'N/A'} tk</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Agent:</p>
                                            <p>{policy.assignedAgent || 'Unassigned'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Payment Status:</p>
                                            <p className={policy.paymentStatus === 'Paid' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                                                {policy.paymentStatus || 'Unknown'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Submitted:</p>
                                            <p>{new Date(policy.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {myPolicies.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="text-5xl mb-4">📄</div>
                    <h3 className="text-2xl font-semibold mb-2">No Policies Found</h3>
                    <p className="text-gray-600">You haven't applied for any policies yet.</p>
                </motion.div>
            )}
        </div>
    );
};

export default MyPolicies;