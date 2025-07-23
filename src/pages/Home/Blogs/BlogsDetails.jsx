import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Loading from "../../../components/Loader/Loading";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

const BlogDetails = () => {
    const { id } = useParams();
    const axiosSecure = UseAxiosSecure();

    const {
        data: blog,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["blog", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/blogs/${id}`);
            return res.data;
        },
    });

    if (isLoading) return <Loading />;
    if (isError)
        return (
            <p className="text-center text-red-600 font-semibold py-10">
                Failed to load blog.
            </p>
        );

    return (
        <motion.div
            className="max-w-5xl mx-auto py-12 px-6 md:px-12 mt-30 bg-gradient-to-br from-white via-blue-50 to-indigo-100 shadow-2xl rounded-3xl"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
        >
            {/* Featured Image */}
            {blog.image && (
                <motion.img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-80 object-cover rounded-xl mb-8 shadow-md"
                    initial={{ scale: 0.95 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                />
            )}

            {/* Blog Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-6 leading-snug">
                {blog.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center space-x-5 mb-8">
                <div className="w-14 h-14 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center font-bold text-xl shadow">
                    {blog.author?.[0]}
                </div>
                <div>
                    <p className="text-lg font-medium text-indigo-800">{blog.author}</p>
                    <p className="text-sm text-gray-600">
                        Published on{" "}
                        <span className="text-indigo-600 font-semibold">
                            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </p>
                </div>
            </div>

            {/* Blog Content */}
            <motion.article
                className="prose prose-indigo prose-lg text-gray-800 max-w-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {blog.content}
            </motion.article>
        </motion.div>
    );
};

export default BlogDetails;
