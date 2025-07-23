import Swal from "sweetalert2";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const NewsletterSubscription = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosSecure = UseAxiosSecure();

    const onSubmit = async (data) => {
        try {
            await axiosSecure.post("/newsletter-subscriptions", data);
            Swal.fire({
                title: "🎉 Subscribed!",
                text: "You've successfully joined the newsletter.",
                icon: "success",
                confirmButtonColor: "#6366F1",
            });
            reset();
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "❌ Error",
                text: "Subscription failed. Try again later.",
                icon: "error",
                confirmButtonColor: "#EF4444",
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-md my-20 mx-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-lg border border-purple-200 rounded-xl p-8"
        >
            <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-6 tracking-wide">
                📬 Join Our Newsletter
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-purple-700 font-semibold mb-1">Your Name</label>
                    <input
                        {...register("name", { required: true })}
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500 transition"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-purple-700 font-semibold mb-1">Email Address</label>
                    <input
                        {...register("email", {
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        })}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-lg border-2 border-pink-300 focus:outline-none focus:border-pink-500 transition"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">Valid email is required</p>}
                </div>

                {/* Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all"
                >
                    🚀 Subscribe Now
                </motion.button>
                
            </form>
        </motion.div>
    );
};

export default NewsletterSubscription;
