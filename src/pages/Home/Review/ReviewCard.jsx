import { FaStar, FaRegStar } from "react-icons/fa";

const ReviewCard = ({ review }) => {
    const { userName, rating, feedback, photo } = review;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <img
                    src={photo}
                    alt={userName}
                    className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                    <h3 className="font-semibold text-lg">{userName}</h3>
                </div>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, index) =>
                    index < rating ? (
                        <FaStar key={index} />
                    ) : (
                        <FaRegStar key={index} />
                    )
                )}
            </div>
            <p className="text-gray-700">{feedback}</p>
        </div>
    );
};

export default ReviewCard;
