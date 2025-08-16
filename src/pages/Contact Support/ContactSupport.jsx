import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeadset } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import UseAuth from "../../Hooks/UseAuth";

// const MySwal = withReactContent(Swal);

const ContactSupport = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await axiosSecure.post("/contact", {
                ...data,
                email: user?.email || data.email,
            });

            if (res.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Message Sent!",
                    text: "✅ Your message has been sent successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                reset();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: "❌ Failed to send message. Please try again.",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "❌ Something went wrong!",
            });
        }
    };

    return (
        <motion.div
            className="max-w-6xl mx-auto px-4 py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Heading */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary">📞 Contact & Support</h1>
                <p className="mt-2 text-base-content/70">
                    Need help? Our support team is always ready to assist you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-base-200 p-5 rounded-xl shadow-md hover:shadow-lg transition">
                        <FaPhoneAlt className="text-primary text-xl" />
                        <div>
                            <h3 className="font-semibold text-base-content">Phone</h3>
                            <p className="text-base-content/70">+880 1610665069</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-base-200 p-5 rounded-xl shadow-md hover:shadow-lg transition">
                        <FaEnvelope className="text-primary text-xl" />
                        <div>
                            <h3 className="font-semibold text-base-content">Email</h3>
                            <p className="text-base-content/70">sshapa17@gmail.com</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-base-200 p-5 rounded-xl shadow-md hover:shadow-lg transition">
                        <FaMapMarkerAlt className="text-primary text-xl" />
                        <div>
                            <h3 className="font-semibold text-base-content">Office</h3>
                            <p className="text-base-content/70">Chottogram, Bangladesh</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-base-200 p-5 rounded-xl shadow-md hover:shadow-lg transition">
                        <FaHeadset className="text-primary text-xl" />
                        <div>
                            <h3 className="font-semibold text-base-content">Live Chat</h3>
                            <p className="text-base-content/70">Available 24/7 inside the app</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-base-200 p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-base-content mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            {...register("name", { required: "Name is required" })}
                            className="input input-bordered w-full"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                        <input
                            type="email"
                            placeholder="Your Email"
                            {...register("email", { required: "Email is required" })}
                            className="input input-bordered w-full"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                        <textarea
                            placeholder="Your Message"
                            {...register("message", { required: "Message is required" })}
                            className="textarea textarea-bordered w-full h-32"
                        />
                        {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}

                        <button type="submit" className="btn btn-primary w-full">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactSupport;
