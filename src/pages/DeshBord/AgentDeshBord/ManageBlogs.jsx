import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaCalendarAlt,
    FaUser,
    FaFileAlt,
    FaSearch,
    FaFilter,
    FaSync,
    FaTimes,
    FaEye
} from "react-icons/fa";
import { MdDashboard, MdPublishedWithChanges } from "react-icons/md";
import UseAuth from "../../../Hooks/UseAuth";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import Loading from "../../../components/Loader/Loading";
import PageTitle from "../../../Hooks/PageTItle";

export default function ManageBlogs() {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [viewMode, setViewMode] = useState("list"); // "list" or "grid"

    const { data: blogs = [], refetch, isLoading } = useQuery({
        queryKey: ["blogs", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/blogs?email=${user?.email}`);
            return res.data;
        }
    });

    const { data: users = [] } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data;
        },
    });

    const currentUser = users.find(use => use.email === user?.email);
    const isAdmin = currentUser?.role === "admin";
    const userBlogs = isAdmin ? blogs : blogs.filter(blog => blog.authorEmail === user?.email);

    // Filter blogs based on search
    const filteredBlogs = userBlogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newBlog = {
            ...formData,
            author: user?.displayName,
            authorEmail: user?.email,
            publishedAt: new Date().toISOString(),
        };
        try {
            const res = await axiosSecure.post("/blogs", newBlog);
            if (res.data.insertedId) {
                Swal.fire({
                    title: "Success!",
                    text: "Blog published successfully!",
                    icon: "success",
                    confirmButtonColor: "#10B981"
                });
                setShowForm(false);
                setFormData({ title: "", content: "" });
                refetch();
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to publish blog",
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (confirm.isConfirmed) {
            await axiosSecure.delete(`/blogs/${id}`);
            Swal.fire({
                title: "Deleted!",
                text: "Blog has been deleted.",
                icon: "success",
                confirmButtonColor: "#10B981"
            });
            refetch();
        }
    };

    const handleViewDetails = (blog) => {
        setSelectedBlog(blog);
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) return <Loading />;

    return (
        <>
            <PageTitle title="Manage Blogs" />
            <div className="min-h-screen bg-base-100 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary rounded-xl shadow-lg">
                                    <FaFileAlt className="text-2xl text-primary-content" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-base-content">Manage Blogs</h1>
                                    <p className="text-base-content/70 mt-1">
                                        {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''} found
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => refetch()}
                                    className="flex items-center gap-2 px-4 py-3 bg-base-200 border border-base-300 rounded-xl hover:bg-base-300 transition-all duration-200 shadow-sm"
                                >
                                    <FaSync className="text-base-content/70" />
                                    <span className="font-medium text-base-content">Refresh</span>
                                </button>

                                <button
                                    onClick={() => setShowForm(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-content rounded-xl hover:bg-primary-focus transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <FaPlus className="text-lg" />
                                    <span className="font-semibold">New Blog</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-base-200 rounded-xl p-4 shadow-sm border border-base-300">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-lg">
                                        <FaFileAlt className="text-primary text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-base-content/70">Total Blogs</p>
                                        <p className="text-2xl font-bold text-base-content">{userBlogs.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-base-200 rounded-xl p-4 shadow-sm border border-base-300">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-success/20 rounded-lg">
                                        <MdPublishedWithChanges className="text-success text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-base-content/70">Published</p>
                                        <p className="text-2xl font-bold text-base-content">{userBlogs.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-base-200 rounded-xl p-4 shadow-sm border border-base-300">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary/20 rounded-lg">
                                        <FaUser className="text-secondary text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-base-content/70">Your Role</p>
                                        <p className="text-lg font-bold text-base-content capitalize">{currentUser?.role || 'User'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter Bar */}
                        <div className="bg-base-200 rounded-xl p-4 shadow-sm border border-base-300">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                                    <input
                                        type="text"
                                        placeholder="Search blogs by title, content, or author..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-base-100 text-base-content placeholder-base-content/50"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`px-4 py-3 rounded-xl transition-all duration-200 ${viewMode === "list"
                                                ? "bg-primary text-primary-content shadow-lg"
                                                : "bg-base-300 text-base-content hover:bg-base-400"
                                            }`}
                                    >
                                        List View
                                    </button>
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`px-4 py-3 rounded-xl transition-all duration-200 ${viewMode === "grid"
                                                ? "bg-primary text-primary-content shadow-lg"
                                                : "bg-base-300 text-base-content hover:bg-base-400"
                                            }`}
                                    >
                                        Grid View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Blog Creation Form */}
                    {showForm && (
                        <div className="bg-base-100 rounded-2xl shadow-xl p-6 mb-8 border border-base-300 transform transition-all duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-base-content flex items-center gap-2">
                                    <FaEdit className="text-primary" />
                                    Create New Blog
                                </h3>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="p-2 hover:bg-base-200 rounded-lg transition-colors duration-200"
                                >
                                    <FaTimes className="text-base-content/50 text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="font-semibold text-base-content block mb-2">Blog Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter a compelling blog title..."
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-base-100 text-base-content placeholder-base-content/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold text-base-content block mb-2">Content</label>
                                    <textarea
                                        placeholder="Write your amazing content here..."
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-3 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 h-48 resize-vertical bg-base-100 text-base-content placeholder-base-content/50"
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-base-200 rounded-xl">
                                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-content font-semibold">
                                        {getInitials(user?.displayName || 'U')}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-base-content">{user?.displayName}</p>
                                        <p className="text-sm text-base-content/70">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-3 border border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-all duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-success text-success-content rounded-xl hover:bg-success-focus transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FaEdit />
                                            Publish Blog
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Blog Display */}
                    {filteredBlogs.length === 0 ? (
                        <div className="text-center py-16 bg-base-100 rounded-2xl shadow-sm border border-base-300">
                            <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaFileAlt className="text-4xl text-base-content/50" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-content mb-2">No blogs found</h3>
                            <p className="text-base-content/70 mb-6">
                                {searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first blog post"}
                            </p>
                            {searchTerm ? (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="px-6 py-3 bg-primary text-primary-content rounded-xl hover:bg-primary-focus transition-colors duration-200 font-medium"
                                >
                                    Clear Search
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-6 py-3 bg-primary text-primary-content rounded-xl hover:bg-primary-focus transition-all duration-200 font-medium shadow-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <FaPlus />
                                        Create First Blog
                                    </div>
                                </button>
                            )}
                        </div>
                    ) : viewMode === "list" ? (
                        /* Table View for Large Screens */
                        <div className="hidden lg:block bg-base-100 rounded-2xl shadow-sm border border-base-300 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-base-200 border-b border-base-300">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-base-content uppercase tracking-wider">Blog Details</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-base-content uppercase tracking-wider">Author</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-base-content uppercase tracking-wider">Published</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-base-content uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-base-300">
                                    {filteredBlogs.map((blog) => (
                                        <tr key={blog._id} className="hover:bg-base-200 transition-colors duration-150">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <h3 className="font-semibold text-base-content text-lg mb-1">{blog.title}</h3>
                                                    <p className="text-base-content/70 text-sm line-clamp-2">{blog.content.substring(0, 100)}...</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-content text-sm font-semibold">
                                                        {getInitials(blog.author)}
                                                    </div>
                                                    <span className="font-medium text-base-content">{blog.author}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 text-base-content/70">
                                                    <FaCalendarAlt className="text-base-content/50" />
                                                    {formatDate(blog.publishedAt)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(blog)}
                                                        className="p-2 text-info hover:bg-info/20 rounded-lg transition-colors duration-200"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(blog._id)}
                                                        className="p-2 text-error hover:bg-error/20 rounded-lg transition-colors duration-200"
                                                        title="Delete Blog"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Grid View for All Screens */
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredBlogs.map((blog) => (
                                <div key={blog._id} className="bg-base-100 rounded-2xl shadow-sm border border-base-300 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="p-6">
                                        <h3 className="font-bold text-base-content text-xl mb-3 line-clamp-2">{blog.title}</h3>
                                        <p className="text-base-content/70 mb-4 line-clamp-3">{blog.content}</p>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-content text-sm font-semibold">
                                                    {getInitials(blog.author)}
                                                </div>
                                                <span className="font-medium text-base-content text-sm">{blog.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-base-content/70 text-sm">
                                                <FaCalendarAlt />
                                                {formatDate(blog.publishedAt)}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-base-300">
                                            <button
                                                onClick={() => handleViewDetails(blog)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors duration-200 text-sm font-medium"
                                            >
                                                <FaEye />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-error text-error-content rounded-xl hover:bg-error-focus transition-colors duration-200 text-sm font-medium"
                                            >
                                                <FaTrash />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Blog Details Modal */}
                    {selectedBlog && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                            <div className="bg-base-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-bold text-base-content">{selectedBlog.title}</h3>
                                        <button
                                            onClick={() => setSelectedBlog(null)}
                                            className="p-2 hover:bg-base-200 rounded-lg transition-colors duration-200"
                                        >
                                            <FaTimes className="text-base-content/50 text-lg" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl">
                                            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-content font-semibold text-lg">
                                                {getInitials(selectedBlog.author)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-base-content">{selectedBlog.author}</p>
                                                <p className="text-sm text-base-content/70">{selectedBlog.authorEmail}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-base-content mb-3">Content</h4>
                                            <div className="prose max-w-none text-base-content leading-relaxed">
                                                {selectedBlog.content}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-base-content/70">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt />
                                                Published: {formatDate(selectedBlog.publishedAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-base-300">
                                        <button
                                            onClick={() => setSelectedBlog(null)}
                                            className="px-6 py-3 border border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors duration-200 font-medium"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete(selectedBlog._id);
                                                setSelectedBlog(null);
                                            }}
                                            className="px-6 py-3 bg-error text-error-content rounded-xl hover:bg-error-focus transition-colors duration-200 font-medium flex items-center gap-2"
                                        >
                                            <FaTrash />
                                            Delete Blog
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}