import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { Link } from "react-router";
import Loading from "../../components/Loader/Loading";

const PopularPolicies = () => {
    const axiosSecure = UseAxiosSecure();

    const { data: policies = [], isLoading, isError } = useQuery({
        queryKey: ["popularPolicies"],
        queryFn: async () => {
            const res = await axiosSecure.get("/policies/popular?limit=6");
            return res.data;
        },
    });
    console.log(policies)
    if (isLoading) {
       <Loading/>
    }

    if (isError) {
        return <div className="text-center text-red-500">Failed to load policies.</div>;
    }

    return (
        <div className="w-11/12 mx-auto py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Policies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {policies.map((policy) => (
                    <div key={policy._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all border">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">{policy.title}</h3>
                        <p><span className="font-semibold">Coverage:</span> ${policy.coverageAmount}</p>
                        <p><span className="font-semibold">Term:</span> {policy.termDuration} years</p>
                        <p><span className="font-semibold">Purchased:</span> {policy.popularity} times</p>
                        <Link
                            to={`/policies/${policy._id}`}
                            className="mt-3 inline-block text-blue-500 hover:underline"
                        >
                            View Details →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularPolicies;
