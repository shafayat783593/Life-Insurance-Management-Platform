import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Loading from "../../components/Loader/Loading";

const ManageApplications = () => {
    const [selectedApp, setSelectedApp] = useState(null);
    const axiosSecure = UseAxiosSecure()
    // Get all applications
    const { data: applications = [], refetch,isLoading } = useQuery({
        queryKey: ["applications"],
        queryFn: async () => {
            const res = await axiosSecure.get("/applications");
            return res.data;
        },
    });

    // Get agents list
    const { data: agents = [] } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data;
        },
    });

    // Handle agent assign
    const handleAssignAgent = async (id, agentEmail) => {
        await axiosSecure.patch(`/api/applications/${id}/assign`, { agentEmail });
        const selectedAgent = agents.find(agent => agent.email === agentEmail);

        // 3️⃣ Promote user role if found
        if (selectedAgent?._id) {
            await axiosSecure.patch(`/user/role/${selectedAgent._id}/assign`);
        }
        Swal.fire("Assigned!", "Agent assigned successfully", "success");
        refetch();
    };

    // Handle reject
    const handleReject = async (id) => {
        const confirm = await Swal.fire({
            title: "Reject Application?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, reject it",
        });
        if (confirm.isConfirmed) {
            await axiosSecure.patch(`applications/${id}/reject`);
            Swal.fire("Rejected!", "Application has been rejected", "info");
            refetch();
        }
    };
    if(isLoading) return <Loading/>

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">📋 Manage Applications</h2>

            {/* Applications Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
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
                                            onChange={(e) =>
                                                handleAssignAgent(app._id, e.target.value)
                                            }
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
                                </td>
                                <td className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedApp(app)}
                                        className="btn btn-sm btn-info"
                                    >
                                        View
                                    </button>
                                    {app.status === "Pending" && (
                                        <button
                                            onClick={() => handleReject(app._id)}
                                            className="btn btn-sm btn-error"
                                        >
                                            Reject
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Details */}
            <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg bg-white rounded-xl p-6">
                        <Dialog.Title className="text-xl font-bold mb-4">
                            Application Details
                        </Dialog.Title>
                        {selectedApp && (
                            <div className="space-y-2 text-sm text-gray-700">
                                <p><strong>Name:</strong> {selectedApp.name}</p>
                                <p><strong>Email:</strong> {selectedApp.email}</p>
                                <p><strong>Policy:</strong> {selectedApp.policyName}</p>
                                <p><strong>Nominee:</strong> {selectedApp.nomineeName} ({selectedApp.nomineeRelation})</p>
                                <p><strong>Status:</strong> {selectedApp.status}</p>
                                <p><strong>Address:</strong> {selectedApp.address}</p>
                                <p><strong>Health:</strong> {selectedApp.healthDisclosure.map((helth) => <span>{helth}</span>)}</p>
                            </div>
                        )}
                        <div className="mt-6 flex justify-end">
                            <button className="btn" onClick={() => setSelectedApp(null)}>Close</button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default ManageApplications;
