import { ShieldCheck, Headset, Globe, Lock, Clock, LayoutDashboard } from "lucide-react";

const benefits = [
    {
        title: "Instant Quote Calculation",
        icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
        description: "Get real-time quotes tailored to your needs within seconds.",
    },
    {
        title: "Expert Agent Support",
        icon: <Headset className="w-8 h-8 text-blue-600" />,
        description: "Talk to licensed agents who guide you every step of the way.",
    },
    {
        title: "100% Online Application",
        icon: <Globe className="w-8 h-8 text-blue-600" />,
        description: "Apply from the comfort of your home with our digital-first process.",
    },
    {
        title: "Secure Online Payments",
        icon: <Lock className="w-8 h-8 text-blue-600" />,
        description: "Your transactions are encrypted and protected for full peace of mind.",
    },
    {
        title: "Real-Time Claim Tracking",
        icon: <Clock className="w-8 h-8 text-blue-600" />,
        description: "Track your claim progress live and receive timely updates.",
    },
    {
        title: "Personalized Dashboard Access",
        icon: <LayoutDashboard className="w-8 h-8 text-blue-600" />,
        description: "Manage policies, payments, and claims all in one place.",
    },
];

const BenefitsOfLifeSure = () => {
    return (
        <div className="w-11/12 max-w-7xl mx-auto py-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Benefits of LifeSure</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md border p-6 rounded-xl hover:shadow-lg transition-all"
                    >
                        <div className="mb-4">{benefit.icon}</div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">{benefit.title}</h3>
                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BenefitsOfLifeSure;
