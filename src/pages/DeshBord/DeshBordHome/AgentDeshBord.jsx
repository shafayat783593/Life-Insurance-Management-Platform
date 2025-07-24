import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    FaUserAlt,
    FaClipboardList,
    FaCheckCircle,
    FaPen,
    FaTrash,
    FaTimes,
} from "react-icons/fa";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";

// Optional status color styles
const STATUS_COLORS = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
};

const AgentDashboard = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();
    const [modalContent, setModalContent] = useState(null);
    const closeModal = () => setModalContent(null);

    // Assigned Customers (via users collection)
    const { data: assignedCustomers = [], isLoading } = useQuery({
        queryKey: ["assignedCustomers", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/assigned-customers?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });
    console.log(assignedCustomers)

    // Blogs
    const { data: blogs = [], isLoading: loadingBlogs } = useQuery({
        queryKey: ["blogs"],
        queryFn: async () => (await axiosSecure.get("/blogs")).data,
    });

    // Policy Claims
    const { data: claims = [], isLoading: loadingClaims } = useQuery({
        queryKey: ["policy-claims"],
        queryFn: async () => (await axiosSecure.get("/policy-claims")).data,
    });

    const updateCustomerStatus = async (customer, newStatus) => {
        try {
            await axiosSecure.patch(`/users/${customer._id}`, { status: newStatus });
            alert("Status updated! Refresh to see changes.");
            closeModal();
        } catch {
            alert("Failed to update status.");
        }
    };

    const approveClaim = async (claimId, refetch) => {
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to approve this claim?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, approve it!',
            cancelButtonText: 'Cancel',
        });

        if (confirmResult.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/policy-claims/approve/${claimId}`);
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        title: 'Approved!',
                        text: 'The claim has been approved.',
                        icon: 'success',
                    });
                    if (refetch) refetch(); // re-fetch data if provided
                } else {
                    Swal.fire({
                        title: 'No Change',
                        text: 'Claim was already approved or not found.',
                        icon: 'info',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong while approving.',
                    icon: 'error',
                });
            }
        }
    };

    const deleteBlog = async (blogId) => {
        if (!window.confirm("Delete this blog?")) return;
        try {
            await axiosSecure.delete(`/blogs/${blogId}`);
            alert("Blog deleted!");
        } catch {
            alert("Failed to delete blog.");
        }
    };

    const StatusModal = ({ customer }) => {
        const [status, setStatus] = useState(customer.status || "Pending");
        const [saving, setSaving] = useState(false);

        const handleSave = async () => {
            setSaving(true);
            await updateCustomerStatus(customer, status);
            setSaving(false);
        };

        return (
            <div>
                <h3 className="text-2xl font-semibold mb-4">Update Status</h3>
                <select
                    className="w-full p-2 border rounded mb-6"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 border rounded"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        );
    };

    const BlogForm = ({ initialData, onClose }) => {
        const [title, setTitle] = useState(initialData?.title || "");
        const [content, setContent] = useState(initialData?.content || "");
        const [saving, setSaving] = useState(false);

        const saveBlog = async () => {
            setSaving(true);
            try {
                if (initialData) {
                    await axiosSecure.patch(`/blogs/${initialData._id}`, { title, content });
                    alert("Blog updated!");
                } else {
                    await axiosSecure.post("/blogs", {
                        title,
                        content,
                        author: user?.name || "Agent",
                        authorEmail: user?.email || "agent@example.com",
                        publishedAt: new Date().toISOString(),
                    });
                    alert("Blog created!");
                }
                onClose();
            } catch {
                alert("Failed to save blog.");
            }
            setSaving(false);
        };

        return (
            <form onSubmit={(e) => { e.preventDefault(); saveBlog(); }} className="space-y-5">
                <h3 className="text-2xl font-bold">{initialData ? "Edit Blog" : "New Blog"}</h3>
                <input
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    className="w-full border px-3 py-2 rounded"
                    rows={5}
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="border px-4 py-2 rounded">Cancel</button>
                    <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
                        {saving ? "Saving..." : initialData ? "Update" : "Publish"}
                    </button>
                </div>
            </form>
        );
    };

    return (
        <motion.div
            className="max-w-7xl mx-auto p-6 space-y-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Assigned Customers Section */}
            <section>
                <h2 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
                    <FaUserAlt /> Assigned Customers
                </h2>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="overflow-x-auto border rounded">
                        <table className="min-w-full table-auto">
                            <thead className="bg-indigo-600 text-white">
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedCustomers.map((c) => (
                                    <tr key={c._id} className="border-b">
                                        <td className="px-4 py-2">{c.name}</td>
                                        <td className="px-4 py-2">{c.email}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded-full text-sm ${STATUS_COLORS[c.status] || "bg-gray-200"}`}>
                                                {c.status || "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => setModalContent({ type: "statusUpdate", data: c })}
                                                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Blogs Section */}
            <section>
                <h2 className="text-3xl font-bold text-pink-700 mb-6 flex items-center gap-2">
                    <FaClipboardList /> Manage Blogs
                </h2>

                <button
                    onClick={() => setModalContent({ type: "newBlog" })}
                    className="mb-4 bg-pink-600 text-white px-4 py-2 rounded"
                >
                    + New Blog
                </button>

                {loadingBlogs ? (
                    <p>Loading blogs...</p>
                ) : (
                    <ul className="space-y-2">
                        {blogs.map((b) => (
                            <li key={b._id} className="border p-4 rounded bg-pink-50 flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">{b.title}</h4>
                                    <p className="text-sm text-gray-600">{b.author}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setModalContent({ type: "editBlog", data: b })}>
                                        <FaPen className="text-yellow-600" />
                                    </button>
                                    <button onClick={() => deleteBlog(b._id)}>
                                        <FaTrash className="text-red-600" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Policy Claims Section */}
            <section>
                <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
                    <FaCheckCircle /> Policy Claims
                </h2>

                {loadingClaims ? (
                    <p>Loading claims...</p>
                ) : (
                    <ul className="space-y-2">
                        {claims.map((claim) => (
                            <li key={claim._id} className="border p-4 rounded flex justify-between items-center bg-green-50">
                                <div>
                                    <h4 className="font-semibold">{claim.policyTitle}</h4>
                                    <span className={`px-3 py-1 text-sm rounded-full ${STATUS_COLORS[claim.status]}`}>
                                        {claim.status}
                                    </span>
                                </div>
                                {claim.status === "Pending" && (
                                    <button
                                        onClick={() => approveClaim(claim._id)}
                                        className="bg-green-600 text-white px-4 py-1 rounded"
                                    >
                                        Approve
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Modal */}
            {modalContent && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <motion.div
                        className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800"
                        >
                            <FaTimes />
                        </button>

                        {modalContent.type === "statusUpdate" && (
                            <StatusModal customer={modalContent.data} />
                        )}

                        {(modalContent.type === "newBlog" || modalContent.type === "editBlog") && (
                            <BlogForm
                                initialData={modalContent.type === "editBlog" ? modalContent.data : null}
                                onClose={closeModal}
                            />
                        )}
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default AgentDashboard;
