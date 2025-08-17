// src/pages/Dashboard/UserMessages.jsx
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { FaReply } from "react-icons/fa";
import Loading from "../../../components/Loader/Loading";

const UserMessages = () => {
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    const [replyingTo, setReplyingTo] = useState(null);

    // Fetch messages
    const { data: messages = [], isLoading, isError } = useQuery({
        queryKey: ["userMessages"],
        queryFn: async () => {
            const res = await axiosSecure.get("/messages"); // Adjust your backend endpoint
            return res.data;
        },
    });

    // React Hook Form for reply
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        if (!replyingTo) return;
        console.log(data)
        try {
            const res = await axiosSecure.post(`/messages/reply/${replyingTo._id}`, {
                reply: data.reply,
            });
            if (res.data.insertedId || res.data.modifiedCount > 0) {
                toast.success("✅ Reply sent successfully!");
                reset();
                setReplyingTo(null);
                queryClient.invalidateQueries(["userMessages"]); // Refetch messages
            } else {
                toast.error("❌ Failed to send reply.");
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Something went wrong!");
        }
    };

    if (isLoading) return <p className="text-center"><Loading/></p>;
    if (isError) return <p className="text-center text-red-500">Failed to load messages.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-indigo-600">📬 User Messages</h2>
            <div className="space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className="bg-base-200 p-4 rounded-xl shadow hover:shadow-lg transition"
                    >
                        <p className="font-semibold text-lg">{msg.name} ({msg.email})</p>
                        <p className="mt-1 text-gray-700">{msg.message}</p>

                        {/* Reply button */}
                        <button
                            onClick={() => setReplyingTo(msg)}
                            className="mt-3 inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            <FaReply className="mr-2" /> Reply
                        </button>

                        {/* Reply Form */}
                        {replyingTo?._id === msg._id && (
                            <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
                                <textarea
                                    {...register("reply", { required: true })}
                                    placeholder="Type your reply..."
                                    className="textarea textarea-bordered w-full h-20"
                                />
                                <button
                                    type="submit"
                                    className="mt-2 btn btn-primary"
                                >
                                    Send Reply
                                </button>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserMessages;
