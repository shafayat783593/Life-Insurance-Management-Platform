// src/pages/Reviews/AllReviews.jsx
import { useQuery } from "@tanstack/react-query";
import ReviewCard from "./ReviewCard";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const AllReviews = () => {
    const axiosSecure = UseAxiosSecure();

    const { data: reviews = [], isLoading, isError } = useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            const res = await axiosSecure.get("/reviews");
            return res.data;
        },
    });

    if (isLoading)
        return <p className="text-center text-gray-500 mt-10">Loading reviews...</p>;

    if (isError)
        return (
            <p className="text-center text-red-500 mt-10">
                Failed to load reviews. Please try again later.
            </p>
        );

    if (reviews.length === 0)
        return (
            <p className="text-center text-gray-500 mt-10">
                No reviews available yet.
            </p>
        );

    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center text-indigo-600 mb-10">
                🌟 What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                ))}
            </div>
        </section>
    );
};

export default AllReviews;
