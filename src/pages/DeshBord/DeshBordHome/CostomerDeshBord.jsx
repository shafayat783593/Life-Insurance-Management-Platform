import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../../components/Loader/Loading';
import { useNavigate } from 'react-router';


const MyPolicies = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate()

    const { data: myPolicies = [], isLoading } = useQuery({
        queryKey: ['myPolicies', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-policies?email=${user.email}`);
            return res.data;
        },
    });

    const handlePay = (policyId) => {
        console.log('Paying for:', policyId);
        navigate("/dashboard/payment-status")
        // redirect to Stripe or payment logic
    };

    const handleClaim = (policyId) => {
        console.log('Claiming policy:', policyId);
        navigate("/dashboard/claim-request")
        // redirect to Claim Request page
    };

    if (isLoading) return <Loading />;

    const approvedPolicies = myPolicies.filter(p => p.status === 'Approved');
    const rejectedPolicies = myPolicies.filter(p => p.status === 'Rejected');

    return (
        <div className="px-4 md:px-8">
            <h2 className="text-3xl font-bold mb-6 text-center">My Policies</h2>

            <section>
                <h3 className="text-2xl font-semibold text-green-600 mb-4">✅ Approved Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {approvedPolicies.map(policy => (
                        <motion.div
                            key={policy._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="border p-4 rounded-xl shadow "
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <FaCheckCircle className="text-green-500" />
                                <h4 className="text-lg font-bold">{policy.policyData?.title}</h4>
                            </div>
                            <p className="text-sm mb-1">Premium: <strong>{policy.premiumAmount} tk</strong></p>
                            <p className="text-sm  mb-1">Agent: <strong>{policy.assignedAgent || "N/A"}</strong></p>
                            <p className="text-sm mb-3">Payment Status: <strong>{policy.paymentStatus}</strong></p>

                            {policy.paymentStatus === "Due" ? (
                                <button
                                    onClick={() => handlePay(policy._id)}
                                    className="px-4 py-1 bg-yellow-500  rounded hover:bg-yellow-600 transition"
                                >
                                    Pay Now
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleClaim(policy._id)}
                                    className="px-4 py-1 bg-blue-500  rounded hover:bg-blue-600 transition"
                                >
                                    Claim Request
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="mt-10">
                <h3 className="text-2xl font-semibold text-red-500 mb-4">❌ Rejected Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rejectedPolicies.map(policy => (
                        <motion.div
                            key={policy._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="border p-4 rounded-xl shadow "
                        >
                            <h4 className="text-lg font-bold text-red-600">
                                {policy.policyData?.title || 'Untitled Policy'}
                            </h4>

                            <p className="text-md  mt-2">
                                <span className='font-semibold text-red-700'>Reason:</span>{' '}
                                {policy.rejectionFeedback || 'Not specified'}
                            </p>

                            <p className="text-sm mt-2 ">
                                <span className="font-semibold">Premium:</span>{' '}
                                {policy.premiumAmount || 'N/A'} tk
                            </p>

                            <p className="text-sm mt-1 ">
                                <span className="font-semibold">Agent:</span>{' '}
                                {policy.assignedAgent || 'Unassigned'}
                            </p>

                            <p className="text-sm mt-1 ">
                                <span className="font-semibold">Payment Status:</span>{' '}
                                <span className={policy.paymentStatus === 'Paid' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                                    {policy.paymentStatus || 'Unknown'}
                                </span>
                            </p>

                            <p className="text-sm  mt-1">
                                Submitted: {new Date(policy.submittedAt).toLocaleString()}
                            </p>
                        </motion.div>
                    ))}

                </div>
            </section>
        </div>
    );
};

export default MyPolicies