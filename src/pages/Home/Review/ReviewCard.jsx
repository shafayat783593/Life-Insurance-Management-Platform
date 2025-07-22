// src/pages/Reviews/ReviewCard.jsx
import React from "react";
import ReactStars from "react-rating-stars-component";
import { FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({ review }) => {
    const { userName, rating, feedback, photo } = review;

    const gradients = [
        "from-purple-500 to-indigo-500",
        "from-pink-500 to-red-400",
        "from-green-400 to-teal-500",
        "from-yellow-400 to-orange-500",
    ];
    const colorClass = gradients[Math.floor(Math.random() * gradients.length)];

    return (
        <div className={`bg-gradient-to-br ${colorClass} text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition`}>
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={photo || "https://i.pravatar.cc/100"}
                    alt={userName}
                    className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div>
                    <h4 className="text-lg font-bold">{userName}</h4>
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
            <p className="text-sm italic">
                <FaQuoteLeft className="inline mr-1" />
                {feedback}
            </p>
        </div>
    );
};

export default ReviewCard;
