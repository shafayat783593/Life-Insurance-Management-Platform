import { useQuery } from "@tanstack/react-query";
import { Link, NavLink } from "react-router";
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

    if (isLoading) return <div className='flex justify-center items-center mt-50'> <Loading /></div>;
    if (isError)
        return <p className="text-center text-red-500">Failed to load blogs.</p>;

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
                ✨ Latest Blogs & Articles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.slice(0, 4).map((blog, i) => {
                    // Assign colorful gradients
                    const cardColors = [
                        "from-pink-500 to-red-400",
                        "from-blue-500 to-indigo-500",
                        "from-green-500 to-emerald-400",
                        "from-yellow-500 to-orange-400",
                    ];
                    const bgGradient = cardColors[i % cardColors.length];

                    return (
                        <motion.div
                            key={blog._id}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            className={`bg-gradient-to-br ${bgGradient} text-white shadow-xl rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300`}
                        >
                            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                            <p className="text-sm opacity-90 mb-3 break-words line-clamp-4">
                                {blog.content}
                            </p>
                            <p className="text-xs opacity-70 mb-4">By {blog.author}</p>
                            <Link
                                to={`/blogs/${blog._id}`}
                                className="inline-block text-sm font-medium text-white bg-black/20 hover:bg-black/30 transition px-4 py-2 rounded-md"
                            >
                                Read More →
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            <div className="text-center mt-10">
               
              <NavLink
                    to="/All-blogs"
                  
                    type="submit"
                    className="w-40 px-8 scale-0 hover:scale-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all"
                >
                    All Blogs / Articles
                </NavLink>
        
            </div>
        </div>
    );
};

export default LatestBlogs;

