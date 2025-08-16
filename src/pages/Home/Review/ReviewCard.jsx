// src/pages/Reviews/ReviewCard.jsx
import React from "react";
import ReactStars from "react-rating-stars-component";
import { FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({ review }) => {
    const { userName, rating, feedback, userPhoto, policyTitle, createdAt } = review;

    // Fixed gradient color
    const colorClass = "hover:shadow-[0_8px_35px_rgba(59,130,246,0.6)] ";

    return (
        <div
            className={`bg-gradient-to-br ${colorClass}  rounded-2xl p-6 shadow-lg hover:shadow-2xl transition`}
        >
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={userPhoto}
                    alt={userName}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                />
                <div>
                    <h4 className="text-lg font-bold">{userName}</h4>
                    <p className="text-sm">{policyTitle}</p>
                    <ReactStars
                        count={5}
                        value={rating}
                        size={20}
                        edit={false}
                        isHalf={true}
                        activeColor="#ffd700"
                    />
                </div>
            </div>

            <p className="text-sm italic mb-2">
                <FaQuoteLeft className="inline mr-1" />
                {feedback}
            </p>

            <p className="text-xs ">
                {new Date(createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                })}
            </p>
        </div>
    );
};

export default ReviewCard;
