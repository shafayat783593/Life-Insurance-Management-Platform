import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import Loading from '../../components/Loader/Loading';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import PageTitle from '../../Hooks/PageTItle';

const PolicyDetails = () => {
    const { id } = useParams();
    const axiosSecure = UseAxiosSecure()
    // console.log(id)
    const navigate = useNavigate();


    const { data: policy, isLoading, error } = useQuery({
        queryKey: ['policy', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/policies/${id}`);
            return res.data;

        },

        enabled: !!id,
    });
    // console.log(policy)

    if (isLoading) return <Loading />
    if (error) return <p className="text-center text-red-500 py-10">Error loading policy details</p>;

    return (

        <>
            <PageTitle title="Policy Details" /> 
        <motion.div
            className="max-w-4xl mx-auto px-4 py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h1 className="text-3xl font-bold mb-4">{policy?.title}</h1>
            <img src={policy?.image} alt={policy?.title} className="rounded-lg w-full max-h-80 object-cover mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <div>
                    <h2 className="text-xl font-semibold mb-2">📝 Description:</h2>
                    <p>{policy?.description}</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">📊 Details:</h2>
                    <ul className="space-y-2">
                        <li><FaCheckCircle className="inline mr-2 text-green-600" />Category: {policy?.category}</li>
                        <li><FaCheckCircle className="inline mr-2 text-green-600" />Min Age: {policy?.minAge}</li>
                        <li><FaCheckCircle className="inline mr-2 text-green-600" />Max Age: {policy?.maxAge}</li>
                        <li><FaCheckCircle className="inline mr-2 text-green-600" />Coverage: {policy?.coverageRange}</li>
                        <li>
                            <FaCheckCircle className="inline mr-2 text-green-600" />
                            Duration Options: {Array.isArray(policy?.durationOptions) ? policy.durationOptions.join(', ') : policy?.durationOptions || 'N/A'}
                        </li>                        <li><FaCheckCircle className="inline mr-2 text-green-600" />Base Premium Rate: ৳{policy?.basePremiumRate}</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-8">
                <button
                    onClick={() => navigate('/quote', { state: policy })}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                    📈 Get Quote
                </button>
                <button
                    onClick={() => navigate('/agents')}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                    📞 Book Agent Consultation
                </button>
            </div>
        </motion.div>
        </>
    );
};

export default PolicyDetails;
