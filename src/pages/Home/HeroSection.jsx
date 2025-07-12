import { motion } from "framer-motion";
import { Link } from "react-router";

const HeroSection = () => {
    return (
        <div
            className="relative bg-cover bg-center min-h-[90vh] flex items-center justify-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1612831209684-8c8899e0bd94?auto=format&fit=crop&w=1400&q=80')", // replace with your own
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <motion.div
                className="relative z-10 text-center text-white px-4 max-w-2xl"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    Secure Your <span className="text-blue-400">Tomorrow</span> Today
                </h1>
                <p className="text-lg md:text-xl mb-6 text-gray-200">
                    Your peace of mind is our top priority. Get insured, stay protected.
                </p>
                <Link to="/quote">
                    <button className="btn btn-primary px-6 py-3 text-lg rounded-full shadow-lg hover:bg-blue-700 transition">
                        Get a Free Quote
                    </button>
                </Link>
            </motion.div>
        </div>
    );
};

export default HeroSection;
