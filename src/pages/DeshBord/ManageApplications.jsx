import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {
    FaEye,
    FaTimes,
    FaUser,
    FaFileAlt,
    FaCalendar,
    FaSearch,
    FaFilter,
    FaChevronLeft,
    FaChevronRight,
    FaUserShield,
    FaMapMarkerAlt,
    FaHeart,
    FaStethoscope
} from "react-icons/fa";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Loading from "../../components/Loader/Loading";
import PageTitle from "../../Hooks/PageTItle";

const ManageApplications = () => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [rejectionApp, setRejectionApp] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [darkMode, setDarkMode] = useState(false);
    const itemsPerPage = 8;
    const axiosSecure = UseAxiosSecure();

    // Check system preference and saved theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

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
        queryKey: ["user", "agents"],
        queryFn: async () => {
            const res = await axiosSecure.get("/user/agents");
            return res.data;
        },
    });

    // Filter applications based on search and status
    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app?.policyData?.title?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
    const paginatedApps = filteredApplications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to first page when filters change
    const handleFilterChange = (filterType, value) => {
        if (filterType === 'search') setSearchTerm(value);
        if (filterType === 'status') setStatusFilter(value);
        setCurrentPage(1);
    };

    // Assign agent
    const handleAssignAgent = async (id, agentEmail) => {
        try {
            await axiosSecure.patch(`/api/applications/${id}/assign`, { agentEmail });
            const selectedAgent = agents.find(agent => agent.email === agentEmail);
            if (selectedAgent?._id) {
                await axiosSecure.patch(`/user/role/${selectedAgent._id}/assign`);
            }
            Swal.fire({
                title: "Assigned!",
                text: "Agent assigned successfully",
                icon: "success",
                confirmButtonColor: "#10B981"
            });
            refetch();
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to assign agent",
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
        }
    };

    // Handle rejection with modal
    const openRejectModal = (app) => {
        setRejectionApp(app);
        setFeedback("");
    };

    const submitRejection = async () => {
        if (!feedback.trim()) {
            return Swal.fire({
                title: "Error!",
                text: "Please provide feedback",
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
        }

        try {
            await axiosSecure.patch(`/applications/${rejectionApp._id}/reject`, { feedback });
            setRejectionApp(null);
            Swal.fire({
                title: "Rejected!",
                text: "Feedback saved and application rejected.",
                icon: "info",
                confirmButtonColor: "#10B981"
            });
            refetch();
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to reject application",
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";

        switch (status) {
            case "Approved":
                return `${baseClasses} bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700`;
            case "Rejected":
                return `${baseClasses} bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700`;
            case "Pending":
                return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600`;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Dark mode variables
    const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
    const cardBorder = darkMode ? 'border-gray-700' : 'border-gray-200';
    const textPrimary = darkMode ? 'text-white' : 'text-gray-800';
    const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
    const bgGradient = darkMode
        ? 'from-gray-900 to-gray-800'
        : 'from-gray-50 to-gray-100';
    const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800';
    const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

    if (isLoading) return <Loading />;

    return (
        <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-4 md:p-6 transition-colors duration-300`}>
            <PageTitle title="Manage Applications" />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                                <FaFileAlt className="text-2xl text-white" />
                            </div>
                            <div>
                                <h1 className={`text-3xl font-bold ${textPrimary}`}>Manage Applications</h1>
                                <p className={`${textSecondary} mt-1`}>
                                    {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className={`${cardBg} ${cardBorder} rounded-xl p-4 shadow-sm border transition-colors duration-300`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <FaFileAlt className="text-blue-600 dark:text-blue-400 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
                                    <p className={`text-2xl font-bold ${textPrimary}`}>{applications.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className={`${cardBg} ${cardBorder} rounded-xl p-4 shadow-sm border transition-colors duration-300`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <FaCalendar className="text-yellow-600 dark:text-yellow-400 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                                    <p className={`text-2xl font-bold ${textPrimary}`}>
                                        {applications.filter(app => app.status === "Pending").length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`${cardBg} ${cardBorder} rounded-xl p-4 shadow-sm border transition-colors duration-300`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <FaUser className="text-green-600 dark:text-green-400 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                                    <p className={`text-2xl font-bold ${textPrimary}`}>
                                        {applications.filter(app => app.status === "Approved").length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`${cardBg} ${cardBorder} rounded-xl p-4 shadow-sm border transition-colors duration-300`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                    <FaTimes className="text-red-600 dark:text-red-400 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                                    <p className={`text-2xl font-bold ${textPrimary}`}>
                                        {applications.filter(app => app.status === "Rejected").length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className={`${cardBg} ${cardBorder} rounded-xl p-4 shadow-sm border transition-colors duration-300`}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                                <input
                                    type="text"
                                    placeholder="Search applications by name, email, or policy..."
                                    value={searchTerm}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${inputBg}`}
                                />
                            </div>

                            <select
                                className={`border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${inputBg}`}
                                value={statusFilter}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
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
                {filteredApplications.length === 0 && (
                    <div className={`${cardBg} ${cardBorder} rounded-2xl shadow-sm border transition-colors duration-300 text-center py-16`}>
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaFileAlt className="text-4xl text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>No applications found</h3>
                        <p className={`${textSecondary} mb-6`}>
                            {searchTerm || statusFilter !== "All"
                                ? "Try adjusting your search or filter criteria"
                                : "No applications have been submitted yet"
                            }
                        </p>
                        {(searchTerm || statusFilter !== "All") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("All");
                                    setCurrentPage(1);
                                }}
                                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Applications Table */}
                {filteredApplications.length > 0 && (
                    <>
                        {/* Desktop Table */}
                        <div className={`hidden md:block ${cardBg} ${cardBorder} rounded-2xl shadow-sm border transition-colors duration-300 overflow-hidden mb-6`}>
                            <table className="w-full">
                                <thead className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                                    <tr>
                                        <th className={`py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider ${textPrimary}`}>Applicant</th>
                                        <th className={`py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider ${textPrimary}`}>Policy</th>
                                        <th className={`py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider ${textPrimary}`}>Date</th>
                                        <th className={`py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider ${textPrimary}`}>Status</th>
                                        <th className={`py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider ${textPrimary}`}>Agent</th>
                                        <th className={`py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider ${textPrimary}`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {paginatedApps.map((app) => (
                                        <tr key={app._id} className={`transition-colors duration-150 ${hoverBg}`}>
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className={`font-semibold ${textPrimary}`}>{app.name}</p>
                                                    <p className={`text-sm ${textSecondary}`}>{app.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className={`font-medium ${textPrimary}`}>{app?.policyData?.title}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                                                    <FaCalendar className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                                                    {formatDate(app.submittedAt)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={getStatusBadge(app.status)}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {app.status === "Pending" ? (
                                                    <select
                                                        className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${inputBg}`}
                                                        onChange={(e) => handleAssignAgent(app._id, e.target.value)}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Select Agent</option>
                                                        {agents?.map((agent) => (
                                                            <option key={agent._id} value={agent.email}>
                                                                {agent.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <FaUserShield className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                                                        <span className={`text-sm ${textSecondary}`}>
                                                            {app?.assignedAgent || "Not assigned"}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedApp(app)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                                                    >
                                                        <FaEye />
                                                        View
                                                    </button>
                                                    {app.status === "Pending" && (
                                                        <button
                                                            onClick={() => openRejectModal(app)}
                                                            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                                                        >
                                                            <FaTimes />
                                                            Reject
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden grid gap-4 mb-6">
                            {paginatedApps.map(app => (
                                <div key={app._id} className={`${cardBg} ${cardBorder} rounded-2xl shadow-sm border p-4 hover:shadow-lg transition-all duration-300`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className={`font-bold text-lg ${textPrimary}`}>{app.name}</h3>
                                            <p className={`text-sm ${textSecondary}`}>{app.email}</p>
                                        </div>
                                        <span className={getStatusBadge(app.status)}>
                                            {app.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaFileAlt className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                                            <span className={textSecondary}>{app?.policyData?.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaCalendar className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                                            <span className={textSecondary}>{formatDate(app.submittedAt)}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Assign Agent:</label>
                                        {app.status === "Pending" ? (
                                            <select
                                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg}`}
                                                onChange={(e) => handleAssignAgent(app._id, e.target.value)}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Select Agent</option>
                                                {agents?.map((agent) => (
                                                    <option key={agent._id} value={agent.email}>
                                                        {agent.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                                                <FaUserShield className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                                                {app?.assignedAgent || "Not assigned"}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedApp(app)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                                        >
                                            <FaEye />
                                            View
                                        </button>
                                        {app.status === "Pending" && (
                                            <button
                                                onClick={() => openRejectModal(app)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                                            >
                                                <FaTimes />
                                                Reject
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mb-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${darkMode
                                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <FaChevronLeft className="text-sm" />
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-xl transition-colors duration-200 ${currentPage === page
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : darkMode
                                                    ? 'border border-gray-600 text-gray-300 hover:bg-gray-700'
                                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${darkMode
                                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Next
                                    <FaChevronRight className="text-sm" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Application Details Modal */}
                {selectedApp && (
                    <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)} className="relative z-50">
                        <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Dialog.Panel className={`${cardBg} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-300`}>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <Dialog.Title className={`text-2xl font-bold ${textPrimary}`}>
                                            Application Details
                                        </Dialog.Title>
                                        <button
                                            onClick={() => setSelectedApp(null)}
                                            className={`p-2 rounded-xl transition-colors duration-200 ${hoverBg}`}
                                        >
                                            <FaTimes className={textSecondary} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className={`font-semibold mb-2 flex items-center gap-2 ${textPrimary}`}>
                                                    <FaUser className="text-blue-500" />
                                                    Personal Information
                                                </h4>
                                                <div className={`space-y-2 text-sm ${textSecondary}`}>
                                                    <p><strong>Name:</strong> {selectedApp.name}</p>
                                                    <p><strong>Email:</strong> {selectedApp.email}</p>
                                                    <p><strong>Phone:</strong> {selectedApp.phone || 'N/A'}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className={`font-semibold mb-2 flex items-center gap-2 ${textPrimary}`}>
                                                    <FaMapMarkerAlt className="text-green-500" />
                                                    Address
                                                </h4>
                                                <p className={`text-sm ${textSecondary}`}>{selectedApp.address || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className={`font-semibold mb-2 flex items-center gap-2 ${textPrimary}`}>
                                                    <FaFileAlt className="text-purple-500" />
                                                    Policy Information
                                                </h4>
                                                <div className={`space-y-2 text-sm ${textSecondary}`}>
                                                    <p><strong>Policy:</strong> {selectedApp?.policyData?.title}</p>
                                                    <p><strong>Status:</strong>
                                                        <span className={`ml-2 ${getStatusBadge(selectedApp.status)}`}>
                                                            {selectedApp.status}
                                                        </span>
                                                    </p>
                                                    <p><strong>Applied:</strong> {formatDate(selectedApp.submittedAt)}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className={`font-semibold mb-2 flex items-center gap-2 ${textPrimary}`}>
                                                    <FaHeart className="text-red-500" />
                                                    Nominee Details
                                                </h4>
                                                <div className={`space-y-2 text-sm ${textSecondary}`}>
                                                    <p><strong>Nominee:</strong> {selectedApp.nomineeName || 'N/A'}</p>
                                                    <p><strong>Relation:</strong> {selectedApp.nomineeRelation || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedApp.healthDisclosure && selectedApp.healthDisclosure.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <h4 className={`font-semibold mb-3 flex items-center gap-2 ${textPrimary}`}>
                                                <FaStethoscope className="text-orange-500" />
                                                Health Disclosure
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedApp.healthDisclosure.map((issue, index) => (
                                                    <span key={index} className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-3 py-1 rounded-full text-sm">
                                                        {issue}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => setSelectedApp(null)}
                                            className={`px-6 py-3 border rounded-xl transition-colors duration-200 font-medium ${darkMode
                                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                )}

                {/* Rejection Modal */}
                {rejectionApp && (
                    <Dialog open={!!rejectionApp} onClose={() => setRejectionApp(null)} className="relative z-50">
                        <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Dialog.Panel className={`${cardBg} rounded-2xl shadow-2xl w-full max-w-md transition-colors duration-300`}>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <Dialog.Title className={`text-xl font-bold ${textPrimary}`}>
                                            Reject Application
                                        </Dialog.Title>
                                        <button
                                            onClick={() => setRejectionApp(null)}
                                            className={`p-2 rounded-xl transition-colors duration-200 ${hoverBg}`}
                                        >
                                            <FaTimes className={textSecondary} />
                                        </button>
                                    </div>

                                    <p className={`${textSecondary} mb-4`}>
                                        Please provide a reason for rejecting <strong>{rejectionApp.name}'s</strong> application.
                                    </p>

                                    <textarea
                                        className={`w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-vertical ${inputBg}`}
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Write your feedback here..."
                                    />

                                    <div className="flex gap-3 justify-end mt-6">
                                        <button
                                            onClick={() => setRejectionApp(null)}
                                            className={`px-6 py-3 border rounded-xl transition-colors duration-200 font-medium ${darkMode
                                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={submitRejection}
                                            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-medium flex items-center gap-2"
                                        >
                                            <FaTimes />
                                            Reject Application
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default ManageApplications;