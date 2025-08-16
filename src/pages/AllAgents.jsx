import { useQuery } from "@tanstack/react-query";


import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";

import Loading from "../components/Loader/Loading";
import UseAxiosSecure from "../Hooks/UseAxiosSecure";
import PageTitle from "../Hooks/PageTItle";

const AllAgents = () => {
   
const axiosSecure  = UseAxiosSecure()
    const { data: agents = [], isLoading, isError } = useQuery({
        queryKey: ["agents"],
        queryFn: async () => {
            const res = await axiosSecure.get("/agents");
            return res.data;
        },
    });

    if (isLoading) return <div className='flex justify-center items-center mt-50'> <Loading /></div>;
    if (isError) return <p className="text-red-600 text-center mt-6">Failed to load agents.</p>;

    return (

        <>
            <PageTitle title="All Agents" /> 
        
        
        <div className="max-w-7xl mx-auto px-6 py-10">
            
            <h1 className="text-4xl font-bold text-center mb-10 text-indigo-700">
                Our Professional Agents
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {agents.map((agent) => (
                    <motion.div
                        key={agent._id}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br    hover:shadow-[0_8px_35px_rgba(59,130,246,0.6)] 
                            rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition-all"
                    >
                        <img
                            src={agent.photoURL}
                            alt={agent.name}
                            className="w-24 h-24 rounded-full object-cover shadow-lg mb-4 border-4 border-indigo-300"
                        />
                        <h2 className="text-xl font-bold text-indigo-700 mb-1">{agent.name}</h2>
                        <p className="text-gray-600 font-medium mb-2 capitalize">{agent.role}</p>
                        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                            <MdEmail className="text-indigo-500" />
                            <span>{agent.email}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                            Joined: {new Date(agent.created_at).toLocaleDateString()}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
        </>
    );
};

export default AllAgents;
