import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { motion } from "framer-motion";
import Loading from "../../components/Loader/Loading";

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

const FeaturedAgents = () => {
    const axiosSecure = UseAxiosSecure();

    const { data: agents = [], isLoading } = useQuery({
        queryKey: ["featuredAgents"],
        queryFn: async () => {
            const res = await axiosSecure.get("/featured-agents");
            return res.data;
        },
    });
console.log(agents)
    if (isLoading) return <div className='flex justify-center items-center mt-50'> <Loading /></div>;
    return (
        <section className="py-16 px-4 md:px-8 ">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-indigo-700 mb-12 roboto ">🌟 Meet Our Top Agents</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {agents.map((agent, index) => (
                        <motion.div
                            key={agent._id}
                            className=" rounded-xl overflow-hidden p-6 
               shadow-md hover:shadow-[0_8px_35px_rgba(59,130,246,0.6)] 
               transition-all duration-500"
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                        >
                            <img
                                src={agent.photoURL}
                                alt={agent.name}
                                className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-indigo-500"
                            />
                            <h3 className="mt-4 text-xl font-bold text-purple-700">{agent.name}</h3>
                            <p className="text-sm text-pink-600 mb-3">{agent.email}</p>
                            <div className="mt-4 text-left space-y-1 text-sm">
                                <p>
                                    <span className="text-gray-700 font-medium">Experience:</span>{" "}
                                    <span className="text-blue-600">5+ years</span>
                                </p>
                                <p>
                                    <span className="text-gray-700 font-medium">Specialties:</span>{" "}
                                    <span className="text-green-600">Life, Health, Auto Insurance</span>
                                </p>
                                <p>
                                    <span className="text-gray-700 font-medium">Last Login:</span>{" "}
                                    <span className="text-rose-500">
                                        {new Date(agent.lastLogin).toLocaleString()}
                                    </span>
                                </p>
                            </div>
                        </motion.div>



                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedAgents;
