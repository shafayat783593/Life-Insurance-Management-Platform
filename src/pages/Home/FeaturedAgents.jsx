import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const FeaturedAgents = () => {
const axiosSecure= UseAxiosSecure()

    const { data: agents = [], isLoading } = useQuery({
        queryKey: ["featuredAgents"],
        queryFn: async () => {
            const res = await axiosSecure.get("/featured-agents");
            return res.data;
        },
    });

    if (isLoading) return <p className="text-center py-10">Loading agents...</p>;

    return (
        <section className="py-12 px-4 md:px-8 bg-white">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-10">Meet Our Agents</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {agents.map((agent) => (
                        <div key={agent._id} className="bg-gray-50 shadow-lg rounded-xl overflow-hidden p-6 transition hover:shadow-xl">
                            <img
                                src={agent.photoURL}
                                alt={agent.name}
                                className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-indigo-500"
                            />
                            <h3 className="mt-4 text-xl font-semibold">{agent.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{agent.email}</p>
                            <div className="mt-4 text-left space-y-1 text-sm text-gray-700">
                                <p><strong>Experience:</strong> 5+ years</p>
                                <p><strong>Specialties:</strong> Life, Health, Auto Insurance</p>
                                <p><strong>Last Login:</strong> {new Date(agent.lastLogin).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedAgents;
