import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../../components/Loader/Loading';
import { useNavigate } from 'react-router';

const CustomerDashboard = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate()
    const handelpay=()=>{
        navigate("/dashboard/payment-status")
        

    }
    const handelclime=()=>{
        navigate("/dashboard/claim-request")
    }
    const { data: myPolicies = [], isLoading } = useQuery({
        queryKey: ['customer-policies', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applicat?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    if (isLoading) return <Loading />;

    return (
        <motion.div
            className="p-5 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">My Approved Policies</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {myPolicies
                    .filter(policy => policy.status === 'Approved')
                    .map((policy, index) => (
                        <motion.div
                            key={policy._id || index}
                            whileHover={{ scale: 1.02 }}
                            className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white"
                        >
                            <div className="flex">
                                <img
                                    src={policy?.policyData?.image}
                                    alt="Policy"
                                    className="w-32 h-full object-cover"
                                />
                                <div className="p-4 flex-1">
                                    <h3 className="text-xl font-semibold text-indigo-600">
                                        {policy?.policyData?.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm">Coverage: {policy?.quote?.coverageAmount || policy?.policyData?.coverageRange}</p>
                                    <p className="text-sm text-gray-600">
                                        Duration: {policy?.quote?.duration || policy?.policyData?.durationOptions}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Premium: ${policy.premiumAmount} / {policy.frequency}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Payment Status:{' '}
                                        <span
                                            className={`font-semibold ${policy.paymentStatus === 'Paid'
                                                    ? 'text-green-600'
                                                    : 'text-red-500'
                                                }`}
                                        >
                                            {policy.paymentStatus}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600">Agent: {policy.assignedAgent}</p>
                                    <p className="text-sm text-gray-500">
                                        Submitted: {new Date(policy.submittedAt).toLocaleString()}
                                    </p>

                                    <div className="mt-3 flex gap-3">
                                        {policy.paymentStatus === 'Due' && (
                                            <button onClick={handelpay} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg text-sm">
                                                Pay Now
                                            </button>
                                        )}
                                        {policy.paymentStatus === 'Paid' && (
                                            <button onClick={handelclime} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg text-sm">
                                                Claim Request
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
            </div>
        </motion.div>
    );
};

export default CustomerDashboard;
