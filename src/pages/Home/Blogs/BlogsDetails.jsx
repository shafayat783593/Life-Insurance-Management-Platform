import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import Loading from "../../../components/Loader/Loading";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

const BlogDetails = () => {
    const { id } = useParams();
    const axiosSecure = UseAxiosSecure();

    const { data: blog, isLoading, isError } = useQuery({
        queryKey: ["blog", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/blogs/${id}`);
            return res.data;
        },
    });

    if (isLoading) return <Loading />;
    if (isError)
        return (
            <p className="text-center text-red-500 mt-10 font-semibold">
                Failed to load blog.
            </p>
        );

    return (
        <motion.div
            className="max-w-5xl mx-auto py-12 px-6 mt-30 lg:px-12 bg-white shadow-xl rounded-2xl"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
        >
            {/* Optional Featured Image */}
            {blog.image && (
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-80 object-cover rounded-xl mb-8"
                />
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-indigo-700 mb-4">
                {blog.title}
            </h1>

            {/* Author & Published Date */}
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                    {blog.author?.[0]}
                </div>
                <div>
                    <p className="text-md font-medium text-gray-800">{blog.author}</p>
                    <p className="text-sm text-gray-500">
                        Published on{" "}
                        {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* Content */}
            <article className="prose prose-indigo prose-lg text-gray-800 max-w-none">
                {blog.content}
            </article>
        </motion.div>
    );
};

export default BlogDetails;
