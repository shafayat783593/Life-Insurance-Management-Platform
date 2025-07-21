import Swal from "sweetalert2";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { useForm } from "react-hook-form";


const NewsletterSubscription = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosSecure = UseAxiosSecure();

    const onSubmit = async (data) => {
        try {
            await axiosSecure.post("/newsletter-subscriptions", data);
            Swal.fire("Subscribed!", "You've successfully joined the newsletter.", "success");
            reset();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Subscription failed.", "error");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow p-6 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Subscribe to Our Newsletter</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block font-medium">Name</label>
                    <input
                        {...register("name", { required: true })}
                        type="text"
                        placeholder="Your Name"
                        className="input input-bordered w-full"
                    />
                    {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        {...register("email", {
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        })}
                        type="email"
                        placeholder="you@example.com"
                        className="input input-bordered w-full"
                    />
                    {errors.email && <p className="text-red-500 text-sm">Valid email is required</p>}
                </div>

                {/* Submit */}
                <button className="btn btn-primary w-full" type="submit">
                    Subscribe
                </button>
            </form>
        </div>
    );
};

export default NewsletterSubscription;
