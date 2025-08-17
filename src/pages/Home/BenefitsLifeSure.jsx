import { ShieldCheck, Headset, Globe, Lock, Clock, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
    {
        title: "Instant Quote Calculation",
        icon: <ShieldCheck className="w-10 h-10 text-white" />,
        description: "Get real-time quotes tailored to your needs within seconds.",
        bg: "bg-gradient-to-r from-indigo-500 to-purple-500",
    },
    {
        title: "Expert Agent Support",
        icon: <Headset className="w-10 h-10 text-white" />,
        description: "Talk to licensed agents who guide you every step of the way.",
        bg: "bg-gradient-to-r from-pink-500 to-red-500",
    },
    {
        title: "100% Online Application",
        icon: <Globe className="w-10 h-10 text-white" />,
        description: "Apply from the comfort of your home with our digital-first process.",
        bg: "bg-gradient-to-r from-green-400 to-emerald-600",
    },
    {
        title: "Secure Online Payments",
        icon: <Lock className="w-10 h-10 text-white" />,
        description: "Your transactions are encrypted and protected for full peace of mind.",
        bg: "bg-gradient-to-r from-blue-400 to-cyan-600",
    },
    {
        title: "Real-Time Claim Tracking",
        icon: <Clock className="w-10 h-10 text-white" />,
        description: "Track your claim progress live and receive timely updates.",
        bg: "bg-gradient-to-r from-yellow-400 to-orange-500",
    },
    {
        title: "Personalized Dashboard Access",
        icon: <LayoutDashboard className="w-10 h-10 text-white" />,
        description: "Manage policies, payments, and claims all in one place.",
        bg: "bg-gradient-to-r from-teal-400 to-sky-600",
    },
];

const BenefitsOfLifeSure = () => {
    return (
        <div className="w-11/12 max-w-8xl mx-auto py-16">
            <h2 className="text-4xl font-bold text-center  mb-12 roboto ">
                Benefits of <span className="text-blue-600">LifeSure</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={index}
                        className={`p-6 rounded-2xl text-white shadow-xl ${benefit.bg}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="mb-4">{benefit.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                        <p className="text-sm opacity-90 leading-relaxed">{benefit.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default BenefitsOfLifeSure;
