import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAuth from "../../../Hooks/UseAuth";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Loading from "../../../components/Loader/Loading";

export default function ClaimRequest() {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [openModal, setOpenModal] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Fetch approved application + claim info for user
    const {
        data: application = [],
        refetch,
        isLoading,
    } = useQuery({
        queryKey: ["approvedPolicies", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/claims/user-approved?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const onSubmit = async (formData) => {
        if (!selectedPolicy) return;

        const payload = new FormData();
        payload.append("applicationId", selectedPolicy._id);

        payload.append("policyTitle", selectedPolicy.policyData?.title);
        payload.append("userEmail", user?.email);
        payload.append("reason", formData.reason);
        payload.append("status", "Pending");
        payload.append("document", formData.document[0]);
        console.log(selectedPolicy._id)
        try {
            const res = await axiosSecure.post("/claims", payload);
            if (res.data?.insertedId) {
                Swal.fire("✅ Success!", "Your claim request has been submitted.", "success");
                setOpenModal(false);
                reset();
                refetch();
            }
        } catch (error) {
            console.error("❌ Error submitting claim:", error);
            Swal.fire("Error", "Failed to submit your claim. Please try again.", "error");
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">📋 Claim Your Approved Policies</h2>

            {application.length === 0 ? (
                <p>No approved  police found.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow rounded">
                    <table className="table w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3 text-left">Policy Title</th>
                                <th className="p-3">Coverage</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">Claim Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {application.map((appli) => (
                                <tr key={appli._id} className="border-t">
                                    <td className="p-3">{appli.policyData?.title}</td>
                                    <td className="p-3">{appli.quote?.coverageAmount || "-"}</td>
                                    <td className="p-3">{appli.quote?.duration || "-"}</td>
                                    <td className="p-3 font-semibold">
                                        {appli.claimStatus ? (
                                            <span
                                                className={`text-${appli.claimStatus === "Approved" ? "green" : "orange"
                                                    }-600`}
                                            >
                                                {appli.claimStatus}
                                            </span>
                                        ) : (
                                            "Not Claimed"
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {!appli.claimStatus && (
                                            <button
                                                onClick={() => {
                                                    setSelectedPolicy(appli);
                                                    setOpenModal(true);
                                                }}
                                                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                                            >
                                                Claim
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {openModal && selectedPolicy && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                        <h3 className="text-xl font-bold mb-4">Submit Claim</h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
                            <div>
                                <label className="block font-medium mb-1">Policy Name</label>
                                <input
                                    type="text"
                                    value={selectedPolicy.policyData?.title}
                                    readOnly
                                    className="w-full border px-3 py-2 rounded bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Reason for Claim</label>
                                <textarea
                                    {...register("reason", { required: true })}
                                    rows={3}
                                    placeholder="Why are you submitting a claim?"
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {errors.reason && <p className="text-red-500 text-sm">Reason is required</p>}
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Upload Document (PDF/Image)</label>
                                <input
                                    type="file"
                                    accept="application/pdf,image/*"
                                    {...register("document", { required: true })}
                                    className="w-full"
                                />
                                {errors.document && <p className="text-red-500 text-sm">Document is required</p>}
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Submit Claim
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
