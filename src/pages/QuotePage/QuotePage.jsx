import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router";
import { FaCalculator } from "react-icons/fa";

const QuotePage = () => {
    const { register, handleSubmit, reset } = useForm();
    const [quote, setQuote] = useState(null);
    const navigate = useNavigate();
    const loaction = useLocation()
    const  policyData  = loaction.state


    const calculatePremium = (data) => {
        const baseRate = 0.0005; // base rate per month
        const { age, coverageAmount, duration, smoker } = data;

        const ageFactor = age > 50 ? 1.5 : age > 30 ? 1.2 : 1;
        const smokerFactor = smoker === "yes" ? 1.5 : 1;

        const monthlyPremium =
            (coverageAmount * baseRate * smokerFactor * ageFactor).toFixed(2);

        const annualPremium = (monthlyPremium * 12).toFixed(2);

        setQuote({
            monthly: monthlyPremium,
            annual: annualPremium,
        });
    };

    const onSubmit = (data) => {
        data.age = parseInt(data.age);
        data.coverageAmount = parseInt(data.coverageAmount);
        data.duration = parseInt(data.duration);
        calculatePremium(data);
    };

    return (
        <motion.div
            className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <FaCalculator /> Get a Free Quote
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Age</label>
                    <input
                        type="number"
                        {...register("age", { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Gender</label>
                    <select {...register("gender")} className="select select-bordered w-full">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Coverage Amount (৳)</label>
                    <input
                        type="number"
                        {...register("coverageAmount", { required: true })}
                        className="input input-bordered w-full"
                        placeholder="e.g. 2000000"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Duration (Years)</label>
                    <input
                        type="number"
                        {...register("duration", { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Are you a smoker?</label>
                    <select {...register("smoker")} className="select select-bordered w-full">
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4">
                    Calculate Premium
                </button>
            </form>

            {quote && (
                <div className="mt-6 text-center border-t pt-4">
                    <p className="text-lg font-semibold">Estimated Premium</p>
                    <p>Monthly: ৳{quote.monthly}</p>
                    <p>Yearly: ৳{quote.annual}</p>
                    <button
                        onClick={() => navigate("/application", { state: { quote, policyData }})}
                        className="btn btn-accent mt-4"
                    >
                        Apply for Policy
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default QuotePage;
