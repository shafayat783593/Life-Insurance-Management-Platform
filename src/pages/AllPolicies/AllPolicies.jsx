import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { FaFilter } from 'react-icons/fa';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import Loading from '../../components/Loader/Loading';

const PAGE_SIZE = 6;

export default function AllPolicies() {
    const axiosSecure = UseAxiosSecure();
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: policies = [], isLoading, isError } = useQuery({
        queryKey: ['policies'],
        queryFn: async () => {
            const res = await axiosSecure.get('/policies');
            return res.data;
        },
    });

    const categories = useMemo(() => {
        const cats = new Set(policies.map((p) => p.category));
        return ['All', ...cats];
    }, [policies]);

    const filteredPolicies = useMemo(() => {
        if (categoryFilter === 'All') return policies;
        return policies.filter((p) => p.category === categoryFilter);
    }, [policies, categoryFilter]);

    const pageCount = Math.ceil(filteredPolicies.length / PAGE_SIZE);
    const paginatedPolicies = filteredPolicies.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const onCategoryChange = (e) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(1);
    };

    const pageButtons = [];
    for (let i = 1; i <= pageCount; i++) {
        pageButtons.push(
            <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-4 py-2 rounded-lg mx-1 font-semibold transition ${i === currentPage
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'
                    }`}
            >
                {i}
            </button>
        );
    }

    if (isLoading) return <div className='flex justify-center items-center mt-50'> <Loading/></div>;
    if (isError)
        return <p className="p-4 text-center text-red-600">Failed to load policies</p>;

    return (
        <div className="max-w-7xl mx-auto p-4 mt-20">
            <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">
                Explore All Insurance Policies
            </h1>

            {/* Filter Section */}
            <div className="flex items-center mb-6 space-x-3">
                <FaFilter className="text-indigo-500 text-xl" />
                <select
                    value={categoryFilter}
                    onChange={onCategoryChange}
                    className="border border-indigo-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Policy Cards */}
            {paginatedPolicies.length === 0 ? (
                <p className="text-center text-gray-600 mt-10">No policies found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {paginatedPolicies.map((policy) => (
                        <Link
                            key={policy._id}
                            to={`/policies/${policy._id}`}
                            className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-xl transition duration-300 p-4 hover:bg-indigo-50 group"
                        >
                            <img
                                src={
                                    policy.image ||
                                    'https://via.placeholder.com/300x180?text=No+Image'
                                }
                                alt={policy.policyTitle}
                                className="w-full h-44 object-cover rounded-xl mb-4 transition group-hover:scale-105 duration-300"
                            />
                            <h2 className="text-xl font-bold text-indigo-700 mb-1 group-hover:underline">
                                {policy.policyTitle}
                            </h2>
                            <p className="text-sm text-indigo-500 font-medium mb-2">
                                {policy.category}
                            </p>
                            <p className="text-gray-700">
                                {policy.description?.length > 80
                                    ? policy.description.slice(0, 80) + '...'
                                    : policy.description}
                            </p>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="mt-10 flex justify-center">{pageButtons}</div>
        </div>
    );
}
