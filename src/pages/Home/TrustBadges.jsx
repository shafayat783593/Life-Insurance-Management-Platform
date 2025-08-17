import { motion } from "framer-motion";
import { ShieldCheck, Award, Building2, Headphones } from "lucide-react";

function TrustBadges() {
    const badges = [
        {
            id: 1,
            icon: <Building2 className="w-10 h-10 text-blue-600" />,
            title: "Trusted Partners",
            desc: "Collaborating with local hospitals & banks for reliable services.",
        },
        {
            id: 2,
            icon: <Award className="w-10 h-10 text-yellow-500" />,
            title: "Award Winning",
            desc: "Recognized as Best Customer Service 2025 in the insurance sector.",
        },
        {
            id: 3,
            icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
            title: "Secure & Encrypted",
            desc: "All applications are protected with 256-bit encryption.",
        },
        {
            id: 4,
            icon: <Headphones className="w-10 h-10 text-purple-600" />,
            title: "24/7 Support",
            desc: "Our dedicated team is always available to assist you anytime.",
        },
    ];

    return (
        <section className="py-16 ">
            <div className="w-11/12 mx-auto px-6 text-center">
                <motion.h2
                    className="text-3xl font-bold mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Why Customers Trust Us
                </motion.h2>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            className="shadow-lg rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-[0_8px_35px_rgba(59,130,246,0.6)] transition"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            {badge.icon}
                            <h3 className="mt-4 text-lg font-semibold">
                                {badge.title}
                            </h3>
                            <p className="mt-2 text-gray-500 text-sm">{badge.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TrustBadges;
