import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaMoneyCheckAlt } from "react-icons/fa";
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
        if (amount >= 10000000) return (amount / 10000000).toFixed(2) + "কোটি";
        if (amount >= 100000) return (amount / 100000).toFixed(2) + " লাখ";
        if (amount >= 1000) return (amount / 1000).toFixed(2) + " হাজার";
        return amount + " ৳";
    };

    if (isLoading) return <Loading/>;

    return (
        <div className="p-6">
            <PageTitle title="Payment status" /> 
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaMoneyCheckAlt /> Payment Status
            </h2>

            {approvedPolicies.length === 0 ? (
                <p>No approved policies found.</p>
            ) : (
                <>
                    {/* Table for large screens */}
                    <div className="hidden lg:block overflow-x-auto">
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
                                        <td>{policy?.premiumAmount} tk</td>
                                        <td>{policy.frequency}</td>
                                        <td className="font-medium">{policy?.paymentStatus}</td>
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

                    {/* Card format for small screens */}
                    <div className="lg:hidden space-y-4">
                        {approvedPolicies.map((policy) => (
                            <div
                                key={policy._id}
                                className="bg-white rounded shadow-md p-4 border border-base-200"
                            >
                                <h3 className="text-lg font-bold">{policy?.policyData?.title}</h3>
                                <p><span className="font-semibold">Coverage:</span> {formatCoverage(policy?.quote?.coverageAmount)}</p>
                                <p><span className="font-semibold">Premium:</span> {policy?.premiumAmount} ৳</p>
                                <p><span className="font-semibold">Frequency:</span> {policy.frequency}</p>
                                <p><span className="font-semibold">Status:</span> {policy?.paymentStatus}</p>
                                {policy?.paymentStatus === "Due" && (
                                    <button
                                        className="btn btn-sm btn-success mt-2"
                                        onClick={() => handlePay(policy._id)}
                                    >
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
