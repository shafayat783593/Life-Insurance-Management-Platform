import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import {
    FaEye,
    FaCheck,
    FaTimes,
    FaFileAlt,
    FaUser,
    FaDollarSign,
    FaCalendar,
    FaSearch,
    FaFilter,
    FaDownload,
    FaShieldAlt
} from "react-icons/fa";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Loading from "../../../components/Loader/Loading";
import PageTitle from "../../../Hooks/PageTItle";

export default function PolicyClearance() {
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const axiosSecure = UseAxiosSecure();

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

    // Fetch policy by ID when modal is opened
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

    // Filter claims based on search and status
    const filteredClaims = claims.filter(claim => {
        const matchesSearch = claim.policyTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.reason?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || claim.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleApprove = async (id) => {
        const result = await Swal.fire({
            title: "Approve Claim?",
            text: "This action will approve the policy claim and process the payout.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#10B981",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Yes, Approve!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/policy-claims/approve/${id}`);
                Swal.fire({
                    title: "Approved!",
                    text: "The claim has been approved successfully.",
                    icon: "success",
                    confirmButtonColor: "#10B981"
                });
                setSelectedClaim(null);
                refetch();
            } catch (err) {
                Swal.fire({
                    title: "Error!",
                    text: "Something went wrong while approving the claim.",
                    icon: "error",
                    confirmButtonColor: "#EF4444"
                });
            }
        }
    };

    const handleReject = async (id) => {
        const result = await Swal.fire({
            title: "Reject Claim?",
            text: "This action will reject the policy claim.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Yes, Reject!",
            cancelButtonText: "Cancel",
            input: "text",
            inputPlaceholder: "Enter rejection reason...",
            inputValidator: (value) => {
                if (!value) {
                    return "Please provide a rejection reason!";
                }
            }
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/policy-claims/reject/${id}`, {
                    rejectionReason: result.value
                });
                Swal.fire({
                    title: "Rejected!",
                    text: "The claim has been rejected.",
                    icon: "success",
                    confirmButtonColor: "#10B981"
                });
                setSelectedClaim(null);
                refetch();
            } catch (err) {
                Swal.fire({
                    title: "Error!",
                    text: "Something went wrong while rejecting the claim.",
                    icon: "error",
                    confirmButtonColor: "#EF4444"
                });
            }
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";

        switch (status) {
            case "Approved":
                return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
            case "Rejected":
                return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
            case "Pending":
                return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Close modal when clicking outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setSelectedClaim(null);
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <PageTitle title="Policy Clearance" />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                                <FaShieldAlt className="text-2xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Policy Clearance</h1>
                                <p className="text-gray-600 mt-1">
                                    {filteredClaims.length} claim{filteredClaims.length !== 1 ? 's' : ''} found
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FaFileAlt className="text-blue-600 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Claims</p>
                                    <p className="text-2xl font-bold text-gray-800">{claims.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <FaCalendar className="text-yellow-600 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {claims.filter(claim => claim.status === "Pending").length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <FaCheck className="text-green-600 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Approved</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {claims.filter(claim => claim.status === "Approved").length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <FaTimes className="text-red-600 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Rejected</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {claims.filter(claim => claim.status === "Rejected").length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search claims by policy, email, or reason..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <select
                                className="border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                {/* Empty State */}
                {filteredClaims.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaFileAlt className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No claims found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || statusFilter !== "All"
                                ? "Try adjusting your search or filter criteria"
                                : "No policy claims have been submitted yet"
                            }
                        </p>
                        {(searchTerm || statusFilter !== "All") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("All");
                                }}
                                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Table View for Large Screens */}
                {filteredClaims.length > 0 && (
                    <>
                        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Claim Details</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">User</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredClaims.map((claim, index) => (
                                        <tr key={claim._id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{claim.policyTitle}</h3>
                                                    <p className="text-gray-600 text-sm line-clamp-2">{claim.reason}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                        <FaUser />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-700">{claim.userEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={getStatusBadge(claim.status)}>
                                                    {claim.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <FaCalendar className="text-gray-400" />
                                                    {formatDate(claim.createdAt || claim.submittedAt)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedClaim(claim)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                                                    >
                                                        <FaEye />
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Card View for Mobile Screens */}
                        <div className="md:hidden grid gap-4">
                            {filteredClaims.map((claim, index) => (
                                <div key={claim._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all duration-300">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg mb-1">{claim.policyTitle}</h3>
                                            <span className={getStatusBadge(claim.status)}>
                                                {claim.status}
                                            </span>
                                        </div>
                                        <div className="text-right text-sm text-gray-500">
                                            #{index + 1}
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaUser className="text-gray-400" />
                                            <span className="text-gray-600">{claim.userEmail}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaCalendar className="text-gray-400" />
                                            <span className="text-gray-600">{formatDate(claim.createdAt || claim.submittedAt)}</span>
                                        </div>
                                        <p className="text-gray-600 line-clamp-2">{claim.reason}</p>
                                    </div>

                                    <button
                                        onClick={() => setSelectedClaim(claim)}
                                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 font-medium"
                                    >
                                        <FaEye />
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Fixed Modal */}
                {selectedClaim && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={handleBackdropClick}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                            Claim Details
                                        </h2>
                                        <span className={getStatusBadge(selectedClaim.status)}>
                                            {selectedClaim.status}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedClaim(null)}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                                    >
                                        <FaTimes className="text-gray-500 text-lg" />
                                    </button>
                                </div>

                                {/* Claim Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <FaUser className="text-blue-500" />
                                                User Information
                                            </h4>
                                            <p className="text-gray-600">{selectedClaim.userEmail}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <FaFileAlt className="text-green-500" />
                                                Policy Details
                                            </h4>
                                            <p className="text-gray-600 font-medium">{selectedClaim.policyTitle}</p>
                                            <p className="text-sm text-gray-500">Policy ID: {selectedClaim.policyId}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <FaCalendar className="text-purple-500" />
                                                Submission Date
                                            </h4>
                                            <p className="text-gray-600">{formatDate(selectedClaim.createdAt || selectedClaim.submittedAt)}</p>
                                        </div>

                                        {policyDetails && (
                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                    <FaDollarSign className="text-yellow-500" />
                                                    Coverage Amount
                                                </h4>
                                                <p className="text-gray-600 font-bold text-lg">
                                                    ${(policyDetails.coverageAmount ||
                                                        policyDetails.quote?.coverageAmount ||
                                                        policyDetails.coverage ||
                                                        0)?.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Claim Reason */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-700 mb-2">Claim Reason</h4>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-600 leading-relaxed">{selectedClaim.reason}</p>
                                    </div>
                                </div>

                                {/* Document Section */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-700 mb-3">Supporting Document</h4>
                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <a
                                            href={selectedClaim.documentUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            <FaDownload />
                                            Download Document
                                        </a>

                                        {selectedClaim.documentUrl && (
                                            <div className="flex-1">
                                                <img
                                                    src={selectedClaim.documentUrl}
                                                    alt="Claim Document"
                                                    className="max-w-full h-auto max-h-64 rounded-xl border border-gray-200 shadow-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Policy Details */}
                                {policyLoading ? (
                                    <div className="flex justify-center py-4">
                                        <Loading />
                                    </div>
                                ) : (
                                    policyDetails && (
                                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <FaShieldAlt className="text-blue-500" />
                                                Policy Information
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p><strong>Policy Name:</strong> {policyDetails.title || policyDetails.policyData?.title || 'N/A'}</p>
                                                    <p><strong>Coverage Amount:</strong> ${(policyDetails.coverageAmount || policyDetails.quote?.coverageAmount || policyDetails.coverage || 0)?.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p><strong>Premium:</strong> ${policyDetails.premium || policyDetails.policyData?.premium || 'N/A'}</p>
                                                    <p><strong>Category:</strong> {policyDetails.category || policyDetails.policyData?.category || 'N/A'}</p>
                                                </div>
                                            </div>

                                            {/* Additional Policy Info */}
                                            {(policyDetails.description || policyDetails.duration) && (
                                                <div className="mt-4 pt-4 border-t border-blue-200">
                                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                                        {policyDetails.description && (
                                                            <p><strong>Description:</strong> {policyDetails.description}</p>
                                                        )}
                                                        {policyDetails.duration && (
                                                            <p><strong>Duration:</strong> {policyDetails.duration}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}

                                {/* Action Buttons */}
                                {selectedClaim.status === "Pending" && (
                                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => handleApprove(selectedClaim._id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 font-semibold"
                                        >
                                            <FaCheck />
                                            Approve Claim
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedClaim._id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-semibold"
                                        >
                                            <FaTimes />
                                            Reject Claim
                                        </button>
                                    </div>
                                )}

                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedClaim(null)}
                                    className="w-full mt-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}