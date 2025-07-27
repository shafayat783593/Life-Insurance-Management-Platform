import { useState } from "react";

// import { formatAmount } from "../../../utils/formatAmount"; // optional utility
import UseAuth from "../../../Hooks/UseAuth";
import { generatePolicyPdf } from "./generatePolicyPdf";
import { formatAmount } from "./formatAmount";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loader/Loading";
import PageTitle from "../../../Hooks/PageTItle";

const MyPolicies = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const { data: policies = [], isLoading } = useQuery({
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
        if (amount >= 10000000) {
            return (amount / 10000000).toFixed(1) + " Cr";
        } else if (amount >= 100000) {
            return (amount / 100000).toFixed(1) + " L";
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(1) + " K";
        }
        return amount;
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        const form = e.target;
        const rating = form.rating.value;
        const feedback = form.feedback.value;
        console.log("Review Submitted:", { rating, feedback });

        // Optionally post to backend
        setShowReviewModal(false);
    };

    return (
        <div className="p-4 sm:p-6">
            <PageTitle title="My Policies" /> 
            <h2 className="text-xl sm:text-2xl font-bold mb-4">📄 My Policies</h2>

            {isLoading ? (
               <Loading/>
            ) : policies?.length === 0 ? (
                <p>No policies found.</p>
            ) : (
                <>
                    {/* Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="table w-full text-sm sm:text-base">
                            <thead>
                                <tr>
                                    <th>Policy</th>
                                    <th>Coverage</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policies.map((policy) => (
                                    <tr key={policy._id}>
                                        <td>{policy?.policyData?.title}</td>
                                        <td>{formatAmount(policy?.quote?.coverageAmount)}</td>
                                        <td>{policy?.quote?.duration} Year</td>
                                        <td>
                                            <span className={`badge text-xs ${policy.status === "Approved"
                                                ? "badge-success"
                                                : policy.status === "Rejected"
                                                    ? "badge-error"
                                                    : "badge-warning"
                                                }`}>
                                                {policy.status}
                                            </span>
                                        </td>
                                        <td className="flex items-center gap-2">
                                            {policy.status === "Approved" && (
                                                <>
                                                    <button className="btn btn-xs btn-info" onClick={() => handleReview(policy)}>
                                                        Review
                                                    </button>
                                                    <button className="btn btn-xs btn-success" onClick={() => generatePolicyPdf(policy, user)}>
                                                        Download
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-4">
                        {policies.map((policy) => (
                            <div key={policy._id} className="bg-base-100 shadow rounded p-4 border border-base-200">
                                <h3 className="font-semibold">{policy?.policyData?.title}</h3>
                                <p>💰 Coverage: {formatAmount(policy?.quote?.coverageAmount)}</p>
                                <p>📅 Duration: {policy?.quote?.duration} Year</p>
                                <p>
                                    📌 Status:{" "}
                                    <span className={`badge text-xs ${policy.status === "Approved"
                                        ? "badge-success"
                                        : policy.status === "Rejected"
                                            ? "badge-error"
                                            : "badge-warning"
                                        }`}>
                                        {policy.status}
                                    </span>
                                </p>

                                {policy.status === "Approved" && (
                                    <div className="mt-2 flex gap-2">
                                        <button className="btn btn-sm btn-info" onClick={() => handleReview(policy)}>
                                            Review
                                        </button>
                                        <button className="btn btn-sm btn-success" onClick={() => generatePolicyPdf(policy, user)}>
                                            Download
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm sm:max-w-md">
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">Submit Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-3">
                            <select name="rating" className="select select-bordered w-full" required>
                                <option value="">Select Rating</option>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {"⭐".repeat(num)} ({num})
                                    </option>
                                ))}
                            </select>

                            <textarea
                                name="feedback"
                                className="textarea textarea-bordered w-full"
                                placeholder="Write your feedback..."
                                required
                            ></textarea>

                            <div className="flex justify-end gap-2">
                                <button type="submit" className="btn btn-sm sm:btn btn-primary">
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm sm:btn"
                                    onClick={() => setShowReviewModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};



export default MyPolicies;
