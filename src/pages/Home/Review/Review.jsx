import { useQuery } from "@tanstack/react-query";

import ReviewCard from "./ReviewCard"; // আগেই বানানো কম্পোনেন্ট
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const AllReviews = () => {
    const axiosSecure = UseAxiosSecure();

    const { data: reviews = [], isLoading, isError } = useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            const res = await axiosSecure.get("/reviews");
            return res.data;
        }
    });

    if (isLoading) return <p className="text-center">Loading reviews...</p>;
    if (isError) return <p className="text-center text-red-500">Failed to load reviews.</p>;

    return (
        <div className="w-11/12 mx-auto py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
            ))}
        </div>
    );
};

export default AllReviews;
