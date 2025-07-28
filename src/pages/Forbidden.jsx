import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaLock } from "react-icons/fa";
// 

const Forbidden = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col justify-center items-center text-white px-4">
            {/* Icon & Code */}
            {/* <PageTitle title="Forbidden" />  */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                className="text-center"
            >
                <div className="text-[120px] font-extrabold drop-shadow-lg">403</div>
                <FaLock className="text-6xl text-pink-400 mx-auto mt-[-20px]" />
            </motion.div>

            {/* Message */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl font-bold mt-4"
            >
                Forbidden Access
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-lg text-pink-200 mt-2 mb-8 text-center max-w-md"
            >
                Sorry, you don't have permission to access this page. Please return to the homepage or contact the administrator.
            </motion.p>

            {/* Button */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
            >
                <Link
                    to="/"
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                    ← Go Home
                </Link>
            </motion.div>
        </div>
    );
};

export default Forbidden;
