// import { useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import Swal from "sweetalert2";

// import UseAuth from "../../../Hooks/UseAuth";
// import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
// import Modal from "../../ShardeComponents/Modal";
// import Loading from "../../../components/Loader/Loading";
// import PageTitle from "../../../Hooks/PageTItle";

// export default function AssignedCustomers() {
//     const { user } = UseAuth();
//     const axiosSecure = UseAxiosSecure();
//     const [selectedApp, setSelectedApp] = useState(null);

//     // Get assigned customers
//     const { data: assignedApps = [], refetch, isLoading, isError } = useQuery({
//         queryKey: ["assignedApps", user?.email],
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/applications/assigned?agent=${user?.email}`);
//             return res.data;
//         },
//     });
//     // console.log(assignedApps)

    
//     // Update application status
//     const handleStatusChange = async (id, newStatus, policyId) => {
//         try {
//             console.log("Updating application status:", id, newStatus);
//             const statusRes = await axiosSecure.patch(`/applications/${id}/status`, { status: newStatus });
        

//             if (newStatus === "Approved" && policyId) {
       
//                 const countRes = await axiosSecure.patch(`/policies/${policyId}/increase-count`);
          
//             }

//             Swal.fire("Updated!", `Application marked as ${newStatus}`, "success");
//             refetch();
//         } catch (error) {
//             console.error("❌ Error updating application or purchase count:", error);
//             Swal.fire("Error", "Failed to update status", "error");
//         }
//     };
//  if (isLoading) return <Loading/>
//     if (isError) return <p className="p-4 text-center text-red-600">Failed to load policies</p>;
    
//   return (

//     <>
//           <PageTitle title="Assigned Customers" /> 
    
//       <div className="p-6">

//           <h2 className="text-2xl font-bold mb-6">Assigned Customers</h2>

//           {/* Table view for large screens */}
//           <div className="hidden md:block overflow-x-auto">
//               <table className="min-w-full  shadow rounded-lg">
//                   <thead>
//                       <tr className="  text-left">
//                           <th className="py-3 px-4">Customer Name</th>
//                           <th className="py-3 px-4">Email</th>
//                           <th className="py-3 px-4">Policy</th>
//                           <th className="py-3 px-4">Status</th>
//                           <th className="py-3 px-4">Actions</th>
//                       </tr>
//                   </thead>
//                   <tbody>
//                       {assignedApps.map((app) => (
//                           <tr key={app._id} className="border-b">
//                               <td className="py-3 px-4">{app.name}</td>
//                               <td className="py-3 px-4">{app.email}</td>
//                               <td className="py-3 px-4">{app?.policyData?.title}</td>
//                               <td className="py-3 px-4">
//                                   <select
//                                       className="border px-2 py-1 rounded"
//                                       value={app.status}
//                                       onChange={(e) =>
//                                           handleStatusChange(app._id, e.target.value, app?.policyData?._id)
//                                       }
//                                   >
//                                       <option value="Pending">Pending</option>
//                                       <option value="Approved">Approved</option>
//                                       <option value="Rejected">Rejected</option>
//                                   </select>
//                               </td>
//                               <td className="py-3 px-4">
//                                   <button
//                                       onClick={() => setSelectedApp(app)}
//                                       className="text-blue-600 hover:underline"
//                                   >
//                                       View Details
//                                   </button>
//                               </td>
//                           </tr>
//                       ))}
//                   </tbody>
//               </table>
//           </div>

//           {/* Card view for mobile screens */}
//           <div className="md:hidden flex flex-col gap-4">
//               {assignedApps.map((app) => (
//                   <div
//                       key={app._id}
//                       className=" shadow-md rounded-lg p-4 border "
//                   >
//                       <p><strong>Name:</strong> {app.name}</p>
//                       <p><strong>Email:</strong> {app.email}</p>
//                       <p><strong>Policy:</strong> {app?.policyData?.title}</p>
//                       <p className="mt-2"><strong>Status:</strong></p>
//                       <select
//                           className="mt-1 w-full border px-2 py-1 rounded"
//                           value={app.status}
//                           onChange={(e) =>
//                               handleStatusChange(app._id, e.target.value, app?.policyData?._id)
//                           }
//                       >
//                           <option value="Pending">Pending</option>
//                           <option value="Approved">Approved</option>
//                           <option value="Rejected">Rejected</option>
//                       </select>
//                       <button
//                           onClick={() => setSelectedApp(app)}
//                           className="mt-3 text-blue-600 hover:underline"
//                       >
//                           View Details
//                       </button>
//                   </div>
//               ))}
//           </div>

//           {/* Modal */}
//           {selectedApp && (
//               <Modal
//                   isOpen={!!selectedApp}
//                   onClose={() => setSelectedApp(null)}
//                   title="Application Details"
//               >
//                   <p><strong>Name:</strong> {selectedApp.name}</p>
//                   <p><strong>Email:</strong> {selectedApp.email}</p>
//                   <p><strong>Address:</strong> {selectedApp.address}</p>
//                   <p><strong>Nominee:</strong> {selectedApp.nomineeName} ({selectedApp.nomineeRelation})</p>
//                   <p><strong>Health Issues:</strong> {selectedApp.healthDisclosure?.join(", ")}</p>
//               </Modal>
//           )}
//       </div>
//     </>

//     );
// }




















import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

import UseAuth from "../../../Hooks/UseAuth";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Modal from "../../ShardeComponents/Modal";
import Loading from "../../../components/Loader/Loading";
import PageTitle from "../../../Hooks/PageTItle";

export default function AssignedCustomers() {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [selectedApp, setSelectedApp] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Get assigned customers
    const { data: assignedApps = [], refetch, isLoading, isError } = useQuery({
        queryKey: ["assignedApps", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/assigned?agent=${user?.email}`);
            return res.data;
        },
    });

    // Status color function
    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Filter applications based on search and status filter
    const filteredApps = assignedApps.filter(app => {
        const matchesSearch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.policyData?.title?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
    const paginatedApps = filteredApps.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Update application status
    const handleStatusChange = async (id, newStatus, policyId) => {
        if (newStatus === 'Rejected') {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This action will reject the application!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, reject it!',
                cancelButtonText: 'Cancel'
            });

            if (!result.isConfirmed) return;
        }

        setUpdatingId(id);
        try {
            console.log("Updating application status:", id, newStatus);
            const statusRes = await axiosSecure.patch(`/applications/${id}/status`, { status: newStatus });

            if (newStatus === "Approved" && policyId) {
                const countRes = await axiosSecure.patch(`/policies/${policyId}/increase-count`);
            }

            Swal.fire("Updated!", `Application marked as ${newStatus}`, "success");
            refetch();
        } catch (error) {
            console.error("❌ Error updating application or purchase count:", error);
            Swal.fire("Error", "Failed to update status", "error");
        } finally {
            setUpdatingId(null);
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) return <Loading />;

    if (isError) return (
        <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600 font-semibold">Failed to load assigned customers</p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <>
            <PageTitle title="Assigned Customers" />

            <div className="p-4 md:p-6">
                {/* Header with Stats and Controls */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Assigned Customers</h2>
                            <p className="text-gray-600 mt-1">
                                {filteredApps.length} customer{filteredApps.length !== 1 ? 's' : ''} found
                            </p>
                        </div>

                        <button
                            onClick={() => refetch()}
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors self-start"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by name, email, or policy..."
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4">
                            <select
                                className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Assigned</p>
                                <p className="text-2xl font-bold text-gray-800">{assignedApps.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Approved</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {assignedApps.filter(app => app.status === 'Approved').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {assignedApps.filter(app => app.status === 'Pending').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {filteredApps.length === 0 && (
                    <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No customers found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || statusFilter !== "All"
                                ? "Try adjusting your search or filter criteria"
                                : "No customers have been assigned to you yet"
                            }
                        </p>
                        {(searchTerm || statusFilter !== "All") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("All");
                                }}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Table view for large screens */}
                {filteredApps.length > 0 && (
                    <>
                        <div className="hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedApps.map((app) => (
                                        <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="font-medium text-gray-900">{app.name}</p>
                                                    <p className="text-sm text-gray-500">{app.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="text-gray-900">{app?.policyData?.title}</p>
                                                <p className="text-sm text-gray-500">Premium: ${app?.policyData?.premium}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <select
                                                    className={`w-full border px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(app.status)} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                    value={app.status}
                                                    disabled={updatingId === app._id}
                                                    onChange={(e) =>
                                                        handleStatusChange(app._id, e.target.value, app?.policyData?._id)
                                                    }
                                                    aria-label={`Change status for ${app.name}`}
                                                >
                                                    {updatingId === app._id ? (
                                                        <option>Updating...</option>
                                                    ) : (
                                                        <>
                                                            <option value="Pending">Pending</option>
                                                            <option value="Approved">Approved</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </>
                                                    )}
                                                </select>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500">
                                                {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => setSelectedApp(app)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Card view for mobile screens */}
                        <div className="md:hidden flex flex-col gap-4">
                            {paginatedApps.map((app) => (
                                <div
                                    key={app._id}
                                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{app.name}</h3>
                                            <p className="text-sm text-gray-500">{app.email}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <p><strong className="text-gray-700">Policy:</strong> {app?.policyData?.title}</p>
                                        <p><strong className="text-gray-700">Premium:</strong> ${app?.policyData?.premium}</p>
                                        <p><strong className="text-gray-700">Applied:</strong> {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</p>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Update Status:</label>
                                        <select
                                            className={`w-full border px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(app.status)} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            value={app.status}
                                            disabled={updatingId === app._id}
                                            onChange={(e) =>
                                                handleStatusChange(app._id, e.target.value, app?.policyData?._id)
                                            }
                                        >
                                            {updatingId === app._id ? (
                                                <option>Updating...</option>
                                            ) : (
                                                <>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Rejected">Rejected</option>
                                                </>
                                            )}
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => setSelectedApp(app)}
                                        className="w-full mt-3 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        View Full Details
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-lg transition-colors ${currentPage === page
                                                ? 'bg-blue-500 text-white'
                                                : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Modal */}
                {selectedApp && (
                    <Modal
                        isOpen={!!selectedApp}
                        onClose={() => setSelectedApp(null)}
                        title="Application Details"
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Personal Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Name:</strong> {selectedApp.name}</p>
                                        <p><strong>Email:</strong> {selectedApp.email}</p>
                                        <p><strong>Phone:</strong> {selectedApp.phone || 'N/A'}</p>
                                        <p><strong>Address:</strong> {selectedApp.address || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Policy Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Policy:</strong> {selectedApp?.policyData?.title}</p>
                                        <p><strong>Premium:</strong> ${selectedApp?.policyData?.premium}</p>
                                        <p><strong>Status:</strong>
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedApp.status)}`}>
                                                {selectedApp.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Nominee Details</h4>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Nominee Name:</strong> {selectedApp.nomineeName || 'N/A'}</p>
                                    <p><strong>Relation:</strong> {selectedApp.nomineeRelation || 'N/A'}</p>
                                </div>
                            </div>

                            {selectedApp.healthDisclosure && selectedApp.healthDisclosure.length > 0 && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-gray-700 mb-2">Health Disclosure</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedApp.healthDisclosure.map((issue, index) => (
                                            <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                                {issue}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-t pt-4 text-xs text-gray-500">
                                <p>Application ID: {selectedApp._id}</p>
                                <p>Applied on: {selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </>
    );
}
