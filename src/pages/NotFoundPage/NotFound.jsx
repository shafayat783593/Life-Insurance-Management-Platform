import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br ">
            <motion.div
                className="text-center p-10  shadow-2xl rounded-2xl max-w-lg   hover:shadow-[0_8px_35px_rgba(59,130,246,0.6)]"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-8xl font-extrabold text-blue-600">404</h1>
                <h2 className="mt-4 text-2xl font-semibold text-gray-700">
                    Oops! Page Not Found
                </h2>
                <p className="mt-2 text-gray-500">
                    The page you’re looking for doesn’t exist or has been moved.
                </p>

                <Link
                    to="/"
                    className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl transition"
                >
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
}

export default NotFound;
