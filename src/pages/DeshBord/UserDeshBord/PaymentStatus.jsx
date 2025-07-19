import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaMoneyCheckAlt } from "react-icons/fa";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";

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

    const handlePay = (policyId) => {
        navigate(`/dashboard/payment/${policyId}`);
    };

    const formatCoverage = (amount) => {
        if (amount >= 10000000) return (amount / 10000000).toFixed(2) + " Cr";
        if (amount >= 100000) return (amount / 100000).toFixed(2) + " লাখ";
        if (amount >= 1000) return (amount / 1000).toFixed(2) + " হাজার";
        return amount + " ৳";
    };

    if (isLoading) return <p className="text-center py-10">Loading...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaMoneyCheckAlt /> Payment Status
            </h2>

            {approvedPolicies.length === 0 ? (
                <p>No approved policies found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full bg-white shadow rounded">
                        <thead className="bg-base-200">
                            <tr>
                                <th>Policy Name</th>
                                <th>Coverage Amount</th>
                                <th>Premium Amount</th>
                                <th>Payment Frequency</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedPolicies.map((policy) => (
                                <tr key={policy._id}>
                                    <td>{policy?.policyData?.title}</td>
                                    <td>{formatCoverage(policy?.quote?.coverageAmount)}</td>
                                    <td>{policy?.premiumAmount} ৳</td>
                                    <td>{policy.frequency}</td>
                                    <td>{policy?.paymentStatus}</td>
                                    <td>
                                        {policy?.paymentStatus === "Due" && (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handlePay(policy._id)}
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
