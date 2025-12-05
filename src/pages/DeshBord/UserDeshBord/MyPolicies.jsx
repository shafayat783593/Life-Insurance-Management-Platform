// import { useState } from "react";

// // import { formatAmount } from "../../../utils/formatAmount"; // optional utility
// import UseAuth from "../../../Hooks/UseAuth";
// import { generatePolicyPdf } from "./generatePolicyPdf";
// import { formatAmount } from "./formatAmount";
// import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
// import { useQuery } from "@tanstack/react-query";
// import Loading from "../../../components/Loader/Loading";
// import PageTitle from "../../../Hooks/PageTItle";
// import Swal from "sweetalert2";

// const MyPolicies = () => {
//     const { user } = UseAuth();
//     const axiosSecure = UseAxiosSecure();
//     const [showReviewModal, setShowReviewModal] = useState(false);
//     const [selectedPolicy, setSelectedPolicy] = useState(null);

//     const { data: policies = [], isLoading } = useQuery({
//         queryKey: ['myPolicies', user?.email],
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/applications/only-forapply?email=${user.email}`);
//             return res.data;
//         },
//         enabled: !!user?.email,
//     });

//     const handleReview = (policy) => {
//         setSelectedPolicy(policy);
//         setShowReviewModal(true);
//     };


//     const formatAmount = (amount) => {
//         if (amount >= 10000000) return (amount / 10000000).toFixed(2) + "কোটি";
//         if (amount >= 100000) return (amount / 100000).toFixed(2) + " লাখ";
//         if (amount >= 1000) return (amount / 1000).toFixed(2) + " হাজার";
//         return amount + " tk";
//     };
  
//     const handleSubmitReview = async (e) => {
//         e.preventDefault();
//         const form = e.target;
//         const rating = form.rating.value;
//         const feedback = form.feedback.value;

//         const reviewData = {
//             policyId: selectedPolicy._id,
//             userEmail: user.email,
//             userName: user.displayName,
//             userPhoto: user.photoURL,
//             policyTitle: selectedPolicy?.policyData?.title,
//             rating: parseInt(rating),
//             feedback,
//             createdAt: new Date().toISOString(),
//         };

//         try {
//             const res = await axiosSecure.post("/reviews", reviewData);
//             if (res.data.insertedId) {
//                 Swal.fire("Thank you!", "Your review has been submitted.", "success");
//                 setShowReviewModal(false);
//             }
//         } catch (err) {
//             console.error("Review submit error:", err);
//             Swal.fire("Error", "Failed to submit review. Try again.", "error");
//         }
//     };


//     return (
//         <div className="p-4 sm:p-6">
//             <PageTitle title="My Policies" /> 
//             <h2 className="text-xl sm:text-2xl font-bold mb-4">📄 My Policies</h2>

//             {isLoading ? (
//                <Loading/>
//             ) : policies?.length === 0 ? (
//                 <p>No policies found.</p>
//             ) : (
//                 <>
//                     {/* Table View */}
//                     <div className="hidden sm:block overflow-x-auto">
//                         <table className="table w-full text-sm sm:text-base">
//                             <thead>
//                                 <tr>
//                                     <th>Policy</th>
//                                     <th>Coverage</th>
//                                     <th>Duration</th>
//                                     <th>Status</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {policies.map((policy) => (
//                                     <tr key={policy._id}>
//                                         <td>{policy?.policyData?.title}</td>
//                                         <td>{formatAmount(policy?.quote?.coverageAmount)}</td>
//                                         <td>{policy?.quote?.duration} Year</td>
//                                         <td>
//                                             <span className={`badge text-xs ${policy.status === "Approved"
//                                                 ? "badge-success"
//                                                 : policy.status === "Rejected"
//                                                     ? "badge-error"
//                                                     : "badge-warning"
//                                                 }`}>
//                                                 {policy.status}
//                                             </span>
//                                         </td>
//                                         <td className="flex items-center gap-2">
//                                             {policy.status === "Approved" && (
//                                                 <>
//                                                     <button className="btn btn-xs btn-info" onClick={() => handleReview(policy)}>
//                                                         Review
//                                                     </button>
//                                                     <button className="btn btn-xs btn-success" onClick={() => generatePolicyPdf(policy, user)}>
//                                                         Download
//                                                     </button>
//                                                 </>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Mobile Card View */}
//                     <div className="sm:hidden space-y-4">
//                         {policies.map((policy) => (
//                             <div key={policy._id} className="bg-base-100 shadow rounded p-4 border border-base-200">
//                                 <h3 className="font-semibold">{policy?.policyData?.title}</h3>
//                                 <p>💰 Coverage: {formatAmount(policy?.quote?.coverageAmount)}</p>
//                                 <p>📅 Duration: {policy?.quote?.duration} Year</p>
//                                 <p>
//                                     📌 Status:{" "}
//                                     <span className={`badge text-xs ${policy.status === "Approved"
//                                         ? "badge-success"
//                                         : policy.status === "Rejected"
//                                             ? "badge-error"
//                                             : "badge-warning"
//                                         }`}>
//                                         {policy.status}
//                                     </span>
//                                 </p>

//                                 {policy.status === "Approved" && (
//                                     <div className="mt-2 flex gap-2">
//                                         <button className="btn btn-sm btn-info" onClick={() => handleReview(policy)}>
//                                             Review
//                                         </button>
//                                         <button className="btn btn-sm btn-success" onClick={() => generatePolicyPdf(policy, user)}>
//                                             Download
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </>
//             )}

//             {/* Review Modal */}
//             {showReviewModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
//                     <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm sm:max-w-md">
//                         <h3 className="text-lg sm:text-xl font-semibold mb-2">Submit Review</h3>
//                         <form onSubmit={handleSubmitReview} className="space-y-3">
//                             <select name="rating" className="select select-bordered w-full" required>
//                                 <option value="">Select Rating</option>
//                                 {[1, 2, 3, 4, 5].map((num) => (
//                                     <option key={num} value={num}>
//                                         {"⭐".repeat(num)} ({num})
//                                     </option>
//                                 ))}
//                             </select>

//                             <textarea
//                                 name="feedback"
//                                 className="textarea textarea-bordered w-full"
//                                 placeholder="Write your feedback..."
//                                 required
//                             ></textarea>

//                             <div className="flex justify-end gap-2">
//                                 <button type="submit" className="btn btn-sm sm:btn btn-primary">
//                                     Submit
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn btn-sm sm:btn"
//                                     onClick={() => setShowReviewModal(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };



// export default MyPolicies;
















import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaDownload,
    FaStar,
    FaFileAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaEye,
    FaRegStar,
    FaChartLine
} from "react-icons/fa";
import UseAuth from "../../../Hooks/UseAuth";
import { generatePolicyPdf } from "./generatePolicyPdf";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loader/Loading";
import PageTitle from "../../../Hooks/PageTItle";
import Swal from "sweetalert2";

const MyPolicies = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [expandedPolicy, setExpandedPolicy] = useState(null);

    const { data: policies = [], isLoading, refetch } = useQuery({
        queryKey: ['myPolicies', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/only-forapply?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const handleReview = (policy) => {
        setSelectedPolicy(policy);
        setShowReviewModal(true);
    };

    const formatAmount = (amount) => {
        if (!amount) return "N/A";
        if (amount >= 10000000) return (amount / 10000000).toFixed(2) + " কোটি";
        if (amount >= 100000) return (amount / 100000).toFixed(2) + " লাখ";
        if (amount >= 1000) return (amount / 1000).toFixed(2) + " হাজার";
        return amount + " টাকা";
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Approved": return <FaCheckCircle className="text-green-500" />;
            case "Rejected": return <FaTimesCircle className="text-red-500" />;
            default: return <FaClock className="text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved": return "border-green-500 text-green-700";
            case "Rejected": return "border-red-500 text-red-700";
            default: return "border-yellow-500 text-yellow-700";
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const form = e.target;
        const rating = form.rating.value;
        const feedback = form.feedback.value;

        const reviewData = {
            policyId: selectedPolicy._id,
            userEmail: user.email,
            userName: user.displayName,
            userPhoto: user.photoURL,
            policyTitle: selectedPolicy?.policyData?.title,
            rating: parseInt(rating),
            feedback,
            createdAt: new Date().toISOString(),
        };

        try {
            const res = await axiosSecure.post("/reviews", reviewData);
            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thank you!',
                    text: 'Your review has been submitted.',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {
                        popup: 'border-2 border-green-500 shadow-lg'
                    }
                });
                setShowReviewModal(false);
                refetch();
            }
        } catch (err) {
            console.error("Review submit error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to submit review. Try again.',
                customClass: {
                    popup: 'border-2 border-red-500 shadow-lg'
                }
            });
        }
    };

    const toggleExpand = (policyId) => {
        setExpandedPolicy(expandedPolicy === policyId ? null : policyId);
    };

    if (isLoading) return <Loading />;

    // Calculate statistics
    const approvedCount = policies.filter(p => p.status === "Approved").length;
    const pendingCount = policies.filter(p => p.status === "Pending").length;
    const rejectedCount = policies.filter(p => p.status === "Rejected").length;

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <PageTitle title="My Policies" />

            {/* Header with Stats */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
                    <FaFileAlt className="text-blue-500" /> My Insurance Policies
                </h1>
                <p className="text-gray-600 mb-6">Manage and track all your insurance applications</p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-green-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-green-700">Approved</h3>
                                <p className="text-2xl font-bold">{approvedCount}</p>
                            </div>
                            <FaCheckCircle className="text-3xl text-green-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-yellow-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-yellow-700">Pending</h3>
                                <p className="text-2xl font-bold">{pendingCount}</p>
                            </div>
                            <FaClock className="text-3xl text-yellow-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-red-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-red-700">Rejected</h3>
                                <p className="text-2xl font-bold">{rejectedCount}</p>
                            </div>
                            <FaTimesCircle className="text-3xl text-red-500" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Policies List */}
            {policies?.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="text-5xl mb-4">📄</div>
                    <h3 className="text-xl font-semibold mb-2">No Policies Found</h3>
                    <p className="text-gray-600">You haven't applied for any policies yet.</p>
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
                                    <th className="font-bold text-gray-700">Duration</th>
                                    <th className="font-bold text-gray-700">Status</th>
                                    <th className="font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policies.map((policy) => (
                                    <motion.tr
                                        key={policy._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                        className="border-b border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        <td>
                                            <div className="font-semibold">{policy?.policyData?.title}</div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                Premium: {formatAmount(policy?.quote?.premiumAmount)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-semibold">{formatAmount(policy?.quote?.coverageAmount)}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{policy?.quote?.duration} Year</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 ${getStatusColor(policy.status)}`}>
                                                {getStatusIcon(policy.status)}
                                                {policy.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                {policy.status === "Approved" && (
                                                    <>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleReview(policy)}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-blue-500 text-blue-600 hover:shadow-md transition-shadow"
                                                        >
                                                            <FaStar /> Review
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => generatePolicyPdf(policy, user)}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-green-500 text-green-600 hover:shadow-md transition-shadow"
                                                        >
                                                            <FaDownload /> Download
                                                        </motion.button>
                                                    </>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => toggleExpand(policy._id)}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-400 text-gray-600 hover:shadow-md transition-shadow"
                                                >
                                                    <FaEye /> Details
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                        {policies.map((policy) => (
                            <motion.div
                                key={policy._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.01 }}
                                className="rounded-xl border-2 border-gray-200 shadow-lg p-4 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg">{policy?.policyData?.title}</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Applied: {new Date(policy.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full border-2 ${getStatusColor(policy.status)}`}>
                                        {getStatusIcon(policy.status)}
                                        <span className="text-sm font-semibold">{policy.status}</span>
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center p-3 rounded-lg border border-gray-200">
                                        <div className="text-sm font-semibold text-gray-600">Coverage</div>
                                        <div className="font-bold text-lg">{formatAmount(policy?.quote?.coverageAmount)}</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg border border-gray-200">
                                        <div className="text-sm font-semibold text-gray-600">Duration</div>
                                        <div className="font-bold text-lg">{policy?.quote?.duration} Years</div>
                                    </div>
                                </div>

                                <div className="text-center p-3 rounded-lg border border-gray-200 mb-4">
                                    <div className="text-sm font-semibold text-gray-600">Premium Amount</div>
                                    <div className="font-bold text-xl text-green-600">{formatAmount(policy?.quote?.premiumAmount)}</div>
                                </div>

                                {expandedPolicy === policy._id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-4 p-3 rounded-lg border border-gray-200"
                                    >
                                        <h4 className="font-semibold mb-2">Additional Details:</h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>Policy ID: <span className="font-mono">{policy._id.slice(-8)}</span></p>
                                            <p>Agent: {policy.assignedAgent || "Not assigned"}</p>
                                            <p>Payment Status: {policy.paymentStatus || "N/A"}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex gap-2 mt-4">
                                    {policy.status === "Approved" && (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleReview(policy)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-blue-500 text-blue-600 hover:shadow-md transition-shadow"
                                            >
                                                <FaStar /> Review
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => generatePolicyPdf(policy, user)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-green-500 text-green-600 hover:shadow-md transition-shadow"
                                            >
                                                <FaDownload /> Download
                                            </motion.button>
                                        </>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleExpand(policy._id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-400 text-gray-600 hover:shadow-md transition-shadow"
                                    >
                                        <FaEye /> {expandedPolicy === policy._id ? "Less" : "More"}
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {/* Review Modal */}
            <AnimatePresence>
                {showReviewModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            className="absolute inset-0 bg-black/30"
                            onClick={() => setShowReviewModal(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md rounded-2xl border-4 border-blue-500 shadow-2xl overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaStar className="text-2xl text-yellow-500" />
                                    <h3 className="text-xl font-bold">Rate Your Experience</h3>
                                </div>

                                <p className="text-gray-600 mb-6">
                                    How was your experience with <span className="font-semibold">{selectedPolicy?.policyData?.title}</span>?
                                </p>

                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Your Rating</label>
                                        <div className="flex gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <label key={star} className="cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="rating"
                                                        value={star}
                                                        className="hidden"
                                                        required
                                                    />
                                                    <FaStar className="text-3xl text-gray-300 hover:text-yellow-400 peer-checked:text-yellow-500" />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Your Feedback</label>
                                        <textarea
                                            name="feedback"
                                            className="w-full h-32 p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                            placeholder="Share your thoughts about this policy..."
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            className="flex-1 px-4 py-3 rounded-lg border-2 border-blue-500 text-blue-600 font-semibold hover:shadow-lg transition-shadow"
                                        >
                                            Submit Review
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            onClick={() => setShowReviewModal(false)}
                                            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-400 text-gray-600 font-semibold hover:shadow-lg transition-shadow"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyPolicies;








