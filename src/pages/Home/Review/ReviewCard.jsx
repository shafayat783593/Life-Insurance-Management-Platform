// src/pages/Reviews/ReviewCard.jsx
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ review }) => {
    const {
        userName,
        userPhoto,
        policyTitle,
        rating,
        feedback,
        createdAt,
        userEmail,
    } = review;

    return (
        <div className="  hover:shadow-[0_8px_35px_rgba(59,130,246,0.6)]  shadow-lg rounded-xl p-6  transition duration-300">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={userPhoto}
                    alt={userName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                />
                <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                        {userName}
                    </h3>
                    <p className="text-sm text-gray-500">{userEmail}</p>
                </div>
            </div>

            {/* Policy Title */}
            <p className="text-indigo-600 font-semibold mb-2">
                Policy: {policyTitle}
            </p>

            {/* Rating */}
            <div className="flex items-center mb-3">
                {Array.from({ length: 5 }, (_, index) => (
                    <FaStar
                        key={index}
                        className={`${index < rating ? "text-yellow-400" : "text-gray-300"
                            } w-5 h-5`}
                    />
                ))}
            </div>

            {/* Feedback */}
            <p className="text-gray-700 italic mb-4">"{feedback}"</p>

            {/* Date */}
            <p className="text-xs text-gray-400">
                {new Date(createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </p>
        </div>
    );
};

export default ReviewCard;
