import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router"; // fixed import
import { FaShieldAlt, FaClock, FaShoppingCart } from "react-icons/fa";
import Loading from "../../components/Loader/Loading";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const PopularPolicies = () => {
    const axiosSecure = UseAxiosSecure();

    const { data: policies = [], isLoading, isError } = useQuery({
        queryKey: ["popularPolicies"],
        queryFn: async () => {
            const res = await axiosSecure.get("/popularPolicies/popular");
            return res.data;
        },
    });

    if (isLoading) return <div className='flex justify-center items-center mt-50'> <Loading /></div>;
    if (isError)
        return <div className="text-center text-red-500">Failed to load policies.</div>;

    return (
        <div className="w-10/12 mx-auto py-12">
            <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">
                🌟 Popular Insurance Policies
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {policies.map((policy) => (
                    <div
                        key={policy._id}
                        className="group bg-white p-5 rounded-2xl shadow-xl hover:shadow-2xl border border-indigo-100 hover:border-pink-300 transition-all duration-300 hover:scale-[1.03]"
                    >
                        <img
                            src={policy.image}
                            alt={policy.title}
                            className="w-full h-48 object-cover rounded-xl mb-4 group-hover:opacity-90 transition"
                        />

                        <h3 className="text-2xl font-semibold text-indigo-700 group-hover:text-pink-600 mb-2 transition">
                            {policy.title}
                        </h3>

                        <div className="text-gray-700 space-y-1 text-sm">
                            <p className="flex items-center gap-2">
                                <FaShieldAlt className="text-pink-500" /> <span className="font-medium">Coverage:</span>{" "}
                                {policy.coverageRange}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaClock className="text-green-500" /> <span className="font-medium">Term:</span>{" "}
                                {policy.durationOptions}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaShoppingCart className="text-blue-500" /> <span className="font-medium">Purchased:</span>{" "}
                                {policy.purchaseCount} times
                            </p>
                        </div>

                        <div className="mt-4 text-right">
                            <Link
                                to={`/policies/${policy._id}`}
                                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-full text-sm hover:bg-pink-600 transition duration-300"
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularPolicies;
