import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import UseAuth from '../../../Hooks/UseAuth';

export default function MyPolicies() {
    const { user } = UseAuth();
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const { data: policies=[] } = useQuery({
        queryKey: ['myPolicies', user?.email],
        queryFn: async () => {
            const res = await axios.get(`/applications?email=${user.email}`)
            return res.data;
        }
    });

    const handleReview = (policy) => {
        setSelectedPolicy(policy);
        setShowReviewModal(true);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const form = e.target;
        const rating = form.rating.value;
        const feedback = form.feedback.value;

        const review = {
            userEmail: user.email,
            userName: user.displayName,
            policyId: selectedPolicy.policyId,
            rating: parseInt(rating),
            feedback,
            photo: user.photoURL,
        };

      await axios.post('/reviews', review);
        Swal.fire('Submitted!', 'Your review has been added.', 'success');
        setShowReviewModal(false);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">📄 My Policies</h2>
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
                                <td>{policy.policyName}</td>
                                <td>{policy.coverageAmount} লাখ</td>
                                <td>{policy.duration} বছর</td>
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

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h3 className="text-xl font-semibold mb-2">Submit Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-3">
                            <select name="rating" className="select select-bordered w-full" required>
                                <option value="">Select Rating</option>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} Star</option>
                                ))}
                            </select>
                            <textarea name="feedback" className="textarea textarea-bordered w-full" placeholder="Write your feedback..." required></textarea>
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
