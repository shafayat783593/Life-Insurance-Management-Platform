import { useQuery } from "@tanstack/react-query";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Loading from "../../../components/Loader/Loading";
import PageTitle from "../../../Hooks/PageTItle";

export default function PolicyClearance() {
    const [selectedClaim, setSelectedClaim] = useState(null);
    const axiosSecure = UseAxiosSecure()
    const {
        data: claims = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["policyClaims"],
        queryFn: async () => {
            const res = await axiosSecure.get("/policy-claims");
            return res.data;
        },
    });

    // fetch policy by ID when modal is opened
    const {
        data: policyDetails,
        isLoading: policyLoading,
    } = useQuery({
        queryKey: ["policy", selectedClaim?.policyId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/policies/${selectedClaim?.policyId}`);
            return res.data;
        },
        enabled: !!selectedClaim?.policyId,
    });
    console.log(policyDetails?.policyId)

    const handleApprove = async (id) => {
        try {
            await axiosSecure.patch(`/policy-claims/approve/${id}`);
            Swal.fire("Approved!", "The claim has been approved.", "success");
            setSelectedClaim(null);
            refetch();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Something went wrong!", "error");
        }
    };

    if (isLoading) return <Loading/>;

    return (
        <div className="p-4">
            <PageTitle title="Policy Clearence" /> 
            <h2 className="text-2xl font-bold mb-4">Policy Clearance</h2>

            {/* ✅ Table view (only on md and up) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Policy Name</th>
                            <th>User Email</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map((claim, index) => (
                            <tr key={claim._id}>
                                <td>{index + 1}</td>
                                <td>{claim?.policyTitle}</td>
                                <td>{claim.userEmail}</td>
                                <td>
                                    <span
                                        className={`badge ${claim.status === "Approved"
                                            ? "badge-success"
                                            : "badge-warning"
                                            }`}
                                    >
                                        {claim.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setSelectedClaim(claim)}
                                        className="btn btn-sm btn-info"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 📱 Card view for small screens */}
            <div className="grid gap-4 md:hidden">
                {claims.map((claim, index) => (
                    <div key={claim._id} className="bg-white rounded-lg shadow-md p-4 border">
                        <p className="text-sm text-gray-500 mb-1">{index + 1}</p>
                        <p><strong>Policy:</strong> {claim?.policyTitle}</p>
                        <p><strong>User Email:</strong> {claim.userEmail}</p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span
                                className={`badge ${claim.status === "Approved"
                                    ? "badge-success"
                                    : "badge-warning"
                                    }`}
                            >
                                {claim.status}
                            </span>
                        </p>
                        <button
                            onClick={() => setSelectedClaim(claim)}
                            className="btn btn-sm btn-info mt-3 w-full"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedClaim && (
                <Dialog
                    open={!!selectedClaim}
                    onClose={() => setSelectedClaim(null)}
                    className="fixed z-50 inset-0 overflow-y-auto"
                >
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                            <Dialog.Title className="text-xl font-bold mb-2">
                                Claim Details
                            </Dialog.Title>

                            <p>
                                <strong>User Email:</strong> {selectedClaim.userEmail}
                            </p>
                            <p>
                                <strong>Policy Title:</strong> {selectedClaim.policyTitle}
                            </p>
                            <p>
                                <strong>Reason:</strong> {selectedClaim.reason}
                            </p>
                            <p className="mt-2">
                                <strong>Document:</strong>{" "}
                                <a
                                    href={selectedClaim.documentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    View Document
                                </a>
                            </p>

                            {selectedClaim.documentUrl && (
                                <img
                                    src={selectedClaim.documentUrl}
                                    alt="Claim Document"
                                    className="mt-4 max-h-48 w-auto rounded border"
                                />
                            )}

                            {policyLoading ? (
                                <p>Loading policy...</p>
                            ) : (
                                policyDetails && (
                                    <div className="mt-4">
                                        <p>
                                            <strong>Policy Name:</strong> {policyDetails.policyData?.title}
                                        </p>
                                        <p>
                                            <strong>Amount:</strong> ${policyDetails.quote?.coverageAmount}
                                        </p>
                                    </div>
                                )
                            )}

                            {selectedClaim.status !== "Approved" && (
                                <button
                                    onClick={() => handleApprove(selectedClaim._id)}
                                    className="btn btn-success mt-4 w-full"
                                >
                                    Approve
                                </button>
                            )}

                            <button
                                onClick={() => setSelectedClaim(null)}
                                className="btn btn-outline mt-2 w-full"
                            >
                                Close
                            </button>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}

        </div>

    );
}
