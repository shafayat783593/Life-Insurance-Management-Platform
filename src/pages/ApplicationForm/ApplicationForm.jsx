import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import UseAuth from "../../Hooks/UseAuth";
import UseAxios from "../../Hooks/UseAxious";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { useLoaderData, useLocation, useNavigate } from "react-router";

export default function ApplicationForm() {
    const { user, setselectedPolicy } = UseAuth();
    const axiosSecure = UseAxiosSecure()
    const loaction = useLocation()
    const { quote, policyData }= loaction.state

    console.log(quote)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const healthOptions = [
        "Diabetes",
        "High Blood Pressure",
        "Heart Disease",
        "Asthma",
        "None",
    ];

    const onSubmit = async (data) => {
        const selectedFrequency = "monthly"; // or get this from user selection in form
        const premiumAmount =
            selectedFrequency === "monthly"
                ? parseFloat(quote.monthly)
                : parseFloat(quote.annual);

        const application = {
            ...data,
            userEmail: user?.email,
            status: "Pending",
            quote,
            policyData,
            premiumAmount,
            frequency: selectedFrequency,
            paymentStatus:"Due",
            submittedAt: new Date().toISOString(),
        };

        setselectedPolicy(application);

        try {
            const res = await axiosSecure.post("/applications", application);
            if (res.data?.insertedId) {
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    text: 'Your insurance application has been successfully submitted.',
                });
                navigate("/policies");
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Something went wrong. Please try again later.',
            });
            console.error(err);
        }
    };


    
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto p-6 bg-white shadow-2xl rounded-lg mt-30"
        >
            <h2 className="text-2xl font-semibold mb-6 text-center">Policy Application Form</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Personal Info */}
                <div>
                    <h3 className="font-semibold mb-2 text-lg border-b pb-1">Personal Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input {...register("name", { required: true })} placeholder="Full Name" className="input input-bordered w-full" />
                        <input {...register("email", { required: true })} placeholder="Email" defaultValue={user?.email} className="input input-bordered w-full" />
                        <input {...register("address", { required: true })} placeholder="Address" className="input input-bordered w-full" />
                        <input {...register("nid", { required: true })} placeholder="NID / SSN" className="input input-bordered w-full" />
                    </div>
                </div>

                {/* Nominee Info */}
                <div>
                    <h3 className="font-semibold mb-2 text-lg border-b pb-1">Nominee Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input {...register("nomineeName", { required: true })} placeholder="Nominee Name" className="input input-bordered w-full" />
                        <input {...register("nomineeRelation", { required: true })} placeholder="Relationship" className="input input-bordered w-full" />
                    </div>
                </div>

                {/* Health Disclosure */}
                <div>
                    <h3 className="font-semibold mb-2 text-lg border-b pb-1">Health Disclosure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {healthOptions.map((item) => (
                            <label key={item} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={item}
                                    {...register("healthDisclosure")}
                                    className="checkbox checkbox-sm"
                                />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="text-center">
                    <button type="submit" className="btn btn-primary px-8">Submit Application</button>
                </div>
            </form>
        </motion.div>
    );
}
