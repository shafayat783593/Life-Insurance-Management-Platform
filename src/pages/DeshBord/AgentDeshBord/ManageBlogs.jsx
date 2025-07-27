import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

    const { data: blogs = [], refetch,isLoading } = useQuery({
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
    console.log(currentUser)
    const isAdmin = currentUser?.role === "admin";
    console.log(isAdmin)

    const userBlogs = isAdmin ? blogs : blogs.filter(blog => blog.authorEmail === user?.email);
    console.log(userBlogs)

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
                Swal.fire("Success", "Blog published!", "success");
                setShowForm(false);
                setFormData({ title: "", content: "" });
                refetch();
            }
        } catch (error) {
            Swal.fire("Error", "Failed to publish blog", "error");
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        });
        if (confirm.isConfirmed) {
            await axiosSecure.delete(`/blogs/${id}`);
            Swal.fire("Deleted", "Blog removed", "success");
            refetch();
        }
    };


    if(isLoading)return <Loading/>
    return (

        <>
        
            <PageTitle title="Manage Bloges" /> 
        <div className="p-6 max-w-6xl mx-auto">
           
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">📝 Manage Blogs</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary shadow hover:scale-105 transition-transform"
                >
                    + New Blog
                </button>
            </div>

            {/* Blog Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Create New Blog</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="font-medium text-gray-600 block mb-1">Title</label>
                            <input
                                type="text"
                                placeholder="Enter blog title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-medium text-gray-600 block mb-1">Content</label>
                            <textarea
                                placeholder="Write your content here..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="textarea textarea-bordered w-full h-32"
                                required
                            />
                        </div>

                        <div className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700">Author:</span> {user?.displayName}
                        </div>

                        <div className="text-right">
                            <button type="submit" className="btn btn-success px-6">Publish</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Responsive Blog Display */}
            <div>
                {/* Table for large screens */}
                <div className="hidden lg:block bg-white rounded-xl shadow overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-base-200 text-base font-semibold text-gray-700">
                            <tr>
                                <th className="py-3 px-4">Title</th>
                                <th className="py-3 px-4">Author</th>
                                <th className="py-3 px-4">Published Date</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userBlogs.map((blog) => (
                                <tr key={blog._id} className="hover:bg-base-100 transition">
                                    <td className="py-3 px-4">{blog.title}</td>
                                    <td className="py-3 px-4">{blog.author}</td>
                                    <td className="py-3 px-4">{new Date(blog.publishedAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="btn btn-sm btn-error"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card view for small screens */}
                <div className="lg:hidden space-y-4">
                    {userBlogs.map((blog) => (
                        <div key={blog._id} className="card bg-base-100 shadow-lg border">
                            <div className="card-body space-y-1">
                                <h3 className="text-xl font-semibold">{blog.title}</h3>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium text-gray-700">Author:</span> {blog.author}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium text-gray-700">Date:</span> {new Date(blog.publishedAt).toLocaleDateString()}
                                </p>
                                <div className="card-actions justify-end">
                                    <button
                                        onClick={() => handleDelete(blog._id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>


    );
}
