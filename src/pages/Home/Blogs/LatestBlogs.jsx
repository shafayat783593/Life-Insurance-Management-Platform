import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { motion } from "framer-motion";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Loading from "../../../components/Loader/Loading";



const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 },
    }),
};

const LatestBlogs = () => {
    const axiosSecure = UseAxiosSecure();

    const { data: blogs = [], isLoading, isError } = useQuery({
        queryKey: ["latestBlogs"],
        queryFn: async () => {
            const res = await axiosSecure.get("/blogs/latest");
            return res.data;
        },
    });

    if (isLoading) return <Loading />;
    if (isError)
        return <p className="text-center text-red-500">Failed to load blogs.</p>;

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
                ✨ Latest Blogs & Articles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.slice(0, 4).map((blog, i) => (
                    <motion.div
                        key={blog._id}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-xl transition-all duration-300"
                    >
                        <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                            {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                            {blog.content.slice(0, 100)}...
                        </p>
                        <p className="text-xs text-gray-400 mb-4">By {blog.author}</p>
                        <Link
                            to={`/blogs/${blog._id}`}
                            className="inline-block text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-md"
                        >
                            Read More →
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="text-center mt-10">
                <Link
                    to="/All-blogs"
                    className="inline-block bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition"
                >
                    All Blogs / Articles
                </Link>
            </div>
        </div>
    );
};

export default LatestBlogs;

