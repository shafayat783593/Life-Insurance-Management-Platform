import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../../components/Loader/Loading';

export default function MyPolicies() {
    const axiosSecure= UseAxiosSecure()
    const { user } = UseAuth();
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const { data: policies=[] ,isLoading} = useQuery({
        queryKey: ['myPolicies', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications?email=${user.email}`)
            return res.data;
        }
    });
console.log(policies)
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


    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const form = e.target;
        const rating = form.rating.value;
        const feedback = form.feedback.value;

        if (!rating || isNaN(parseInt(rating))) {
            return Swal.fire("Error", "Please select a valid rating.", "error");
        }

        if (!feedback.trim()) {
            return Swal.fire("Error", "Please enter your feedback.", "error");
        }

        const review = {
            userEmail: user.email,
            userName: user.displayName,
            policyId: policies?.policyData?._id, // ✅ Make sure it's _id not policyId
            rating: parseInt(rating),
            feedback,
            photo: user.photoURL,
        };

        try {
            const res = await axiosSecure.post('/reviews', review);
            if (res.data.insertedId) {
                Swal.fire('Submitted!', 'Your review has been added.', 'success');
                setShowReviewModal(false);
            } else {
                Swal.fire('Error', 'Failed to add review.', 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Something went wrong.', 'error');
        }
    };

if(isLoading)return <Loading/>
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">📄 My Policies</h2>
{
    policies===0 ? <p> Not found ..</p>:(
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Policy</th>
                                    <th>Coverage</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Review</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policies?.map(policy => (
                                    <tr key={policy._id}>
                                        <td>{policy?.policyData?.title}</td>
                                        <td>{formatAmount(policy?.quote?.coverageAmount)}</td>                                <td>{policy?.quote?.duration} Year</td>
                                        <td>
                                            <span className={`badge ${policy.status === 'Approved' ? 'badge-success' : policy.status === 'Rejected' ? 'badge-error' : 'badge-warning'}`}>
                                                {policy.status}
                                            </span>
                                        </td>
                                        <td>
                                            {policy.status === 'Approved' && (
                                                <button className="btn btn-sm btn-info" onClick={() => handleReview(policy)}>
                                                    Give Review
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

    )
}
            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h3 className="text-xl font-semibold mb-2">Submit Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-3">
                            <select name="rating" className="select select-bordered w-full" required>
                                <option value="">Select Rating</option>
                                {[1, 2, 3, 4, 5].map(num => (
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
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <button type="button" className="btn" onClick={() => setShowReviewModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
