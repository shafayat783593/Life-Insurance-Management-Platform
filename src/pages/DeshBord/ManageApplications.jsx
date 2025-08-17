import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Loading from "../../components/Loader/Loading";
import PageTitle from "../../Hooks/PageTItle";

const ManageApplications = () => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [rejectionApp, setRejectionApp] = useState(null);
    const [feedback, setFeedback] = useState("");
    const axiosSecure = UseAxiosSecure();

    // Fetch all applications
    const { data: applications = [], refetch, isLoading } = useQuery({
        queryKey: ["applications"],
        queryFn: async () => {
            const res = await axiosSecure.get("/applications");
            return res.data;
        },
    });

    // Fetch all users (agents)
    const { data: agents = [] } = useQuery({
        queryKey: ["user", "agents"], // ✅ More specific and unique
        queryFn: async () => {
            const res = await axiosSecure.get("/user/agents");
            return res.data;
        },
    });

    // Assign agent
    const handleAssignAgent = async (id, agentEmail) => {
        await axiosSecure.patch(`/api/applications/${id}/assign`, { agentEmail });
        const selectedAgent = agents.find(agent => agent.email === agentEmail);
        if (selectedAgent?._id) {
            await axiosSecure.patch(`/user/role/${selectedAgent._id}/assign`);
        }
        Swal.fire("Assigned!", "Agent assigned successfully", "success");
        refetch();
    };

    // Handle rejection with modal
    const openRejectModal = (app) => {
        setRejectionApp(app);
        setFeedback("");
    };

    const submitRejection = async () => {
        if (!feedback.trim()) {
            return Swal.fire("Error", "Please provide feedback", "error");
        }

        try {
            await axiosSecure.patch(`/applications/${rejectionApp._id}/reject`, { feedback });
            setRejectionApp(null);
            Swal.fire("Rejected!", "Feedback saved and application rejected.", "info");
            refetch();
        } catch (error) {
            // console.error(error);
            Swal.fire("Error", "Failed to reject application", "error");
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <PageTitle title="Manage Applications" /> 
            <h2 className="text-2xl font-bold mb-4">📋 Manage Applications</h2>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl shadow overflow-x-auto">
                <table className="table w-full">
                    <thead className="bg-gray-100 text-gray-800">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Policy</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Assign Agent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td>{app.name}</td>
                                <td>{app.email}</td>
                                <td>{app?.policyData?.title}</td>
                                <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                                <td className="font-semibold text-blue-600">{app.status}</td>
                                <td>
                                    {app.status === "Pending" ? (
                                        <select
                                            className="select select-sm select-bordered"
                                            onChange={(e) => handleAssignAgent(app._id, e.target.value)}
                                            defaultValue=""
                                        >
                                            <option disabled value="">Select Agent</option>
                                            {agents?.map((agent) => (
                                                <option key={agent._id} value={agent.email}>
                                                    {agent.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                            <span className="text-gray-600">
                                                Assigned to: <span className="font-medium">{app?.assignedAgent || "Unknown"}</span>
                                            </span>
                                    )}
                                </td>
                                <td className="flex gap-2">
                                    <button onClick={() => setSelectedApp(app)} className="btn btn-sm btn-info">View</button>
                                    {app.status === "Pending" && (
                                        <button onClick={() => openRejectModal(app)} className="btn btn-sm btn-error">Reject</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {applications.map(app => (
                    <div key={app._id} className="bg-white p-4 rounded-xl shadow space-y-2">
                        <div><strong>Name:</strong> {app.name}</div>
                        <div><strong>Email:</strong> {app.email}</div>
                        <div><strong>Policy:</strong> {app?.policyData?.title}</div>
                        <div><strong>Date:</strong> {new Date(app.submittedAt).toLocaleDateString()}</div>
                        <div><strong>Status:</strong> <span className="text-blue-600 font-semibold">{app.status}</span></div>

                        <div>
                            <strong>Assign Agent:</strong><br />
                            {app.status === "Pending" ? (
                                <select
                                    className="select select-sm w-24 select-bordered mt-1 lg:w-full"
                                    onChange={(e) => handleAssignAgent(app._id, e.target.value)}
                                    defaultValue=""
                                >
                                    <option disabled value="">Select Agent</option>
                                    {agents?.map((agent) => (
                                        <option key={agent._id} value={agent.email}>
                                            {agent.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span className="text-gray-400">Assigned</span>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setSelectedApp(app)} className="btn btn-sm btn-info">View</button>
                            {app.status === "Pending" && (
                                <button onClick={() => openRejectModal(app)} className="btn btn-sm btn-error">Reject</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Details Modal */}
            <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg bg-white rounded-xl p-6">
                        <Dialog.Title className="text-xl font-bold text-black mb-4">Application Details</Dialog.Title>
                        {selectedApp && (
                            <div className="space-y-2 text-sm text-gray-700">
                                <p><strong>Name:</strong> {selectedApp.name}</p>
                                <p><strong>Email:</strong> {selectedApp.email}</p>
                                <p><strong>Policy:</strong> {selectedApp?.policyData?.title}</p>
                                <p><strong>Nominee:</strong> {selectedApp.nomineeName} ({selectedApp.nomineeRelation})</p>
                                <p><strong>Status:</strong> {selectedApp.status}</p>
                                <p><strong>Address:</strong> {selectedApp.address}</p>
                                <p><strong>Health:</strong> {selectedApp.healthDisclosure?.join(", ")}</p>
                            </div>
                        )}
                        <div className="mt-6 flex justify-end">
                            <button className="btn" onClick={() => setSelectedApp(null)}>Close</button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Rejection Modal */}
            <Dialog open={!!rejectionApp} onClose={() => setRejectionApp(null)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 space-y-4">
                        <Dialog.Title className="text-lg font-bold">Reject Application</Dialog.Title>
                        <p className="text-sm text-gray-600">Please provide a reason for rejecting this application.</p>
                        <textarea
                            className="textarea textarea-bordered w-full min-h-[120px]"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Write feedback here..."
                        ></textarea>
                        <div className="flex justify-end gap-2">
                            <button className="btn btn-outline" onClick={() => setRejectionApp(null)}>Cancel</button>
                            <button className="btn btn-error" onClick={submitRejection}>Submit</button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>

    );
};

export default ManageApplications;
