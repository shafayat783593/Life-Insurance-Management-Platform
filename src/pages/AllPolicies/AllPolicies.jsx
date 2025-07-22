import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router';
import { FaFilter } from 'react-icons/fa';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import Loading from '../../components/Loader/Loading';

const PAGE_SIZE = 6;

export default function AllPolicies() {
    const axiosSecure= UseAxiosSecure()
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch all policies
    const { data: policies = [] ,isLoading ,isError } = useQuery({
        queryKey: ['policies'],
        queryFn: async () => {
            const res = await axiosSecure.get('/policies');
            return res.data;
        }
    });
      
    // Extract unique categories for filter options
    const categories = useMemo(() => {
        const cats = new Set(policies.map(p => p.category));
        return ['All', ...cats];
    }, [policies]);

    // Filter policies based on selected category
    const filteredPolicies = useMemo(() => {
        if (categoryFilter === 'All') return policies;
        return policies.filter(p => p.category === categoryFilter);
    }, [policies, categoryFilter]);

    // Pagination logic
    const pageCount = Math.ceil(filteredPolicies.length / PAGE_SIZE);
    const paginatedPolicies = filteredPolicies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Handle category change
    const onCategoryChange = (e) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(1);  // reset page on filter change
    };

    // Pagination buttons
    const pageButtons = [];
    for (let i = 1; i <= pageCount; i++) {
        pageButtons.push(
            <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 rounded mx-1 ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
                {i}
            </button>
        );
    }

    if (isLoading) return <Loading/>
    if (isError) return <p className="p-4 text-center text-red-600">Failed to load policies</p>;

    return (
        <div className="max-w-7xl mx-auto p-4 mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center">All Insurance Policies</h1>

            <div className="flex items-center mb-4 space-x-3">
                <FaFilter className="text-gray-600" />
                <select
                    value={categoryFilter}
                    onChange={onCategoryChange}
                    className="border border-gray-300 rounded px-3 py-1"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {paginatedPolicies.length === 0 ? (
                <p>No policies found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {paginatedPolicies.map(policy => (
                        <Link
                            key={policy._id}
                            to={`/policies/${policy._id}`}
                            className="border rounded shadow hover:shadow-lg transition p-4 flex flex-col"
                        >
                            <img
                                src={policy.image || 'https://via.placeholder.com/300x180?text=No+Image'}
                                alt={policy.policyTitle}
                                className="w-full h-44 object-cover rounded mb-3"
                            />
                            <h2 className="text-xl font-semibold mb-1">{policy.policyTitle}</h2>
                            <p className="text-sm text-gray-600 mb-2">{policy.category}</p>
                            <p className="text-gray-700 flex-grow">
                                {policy.description?.length > 80
                                    ? policy.description.slice(0, 80) + '...'
                                    : policy.description}
                            </p>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
                {pageButtons}
            </div>
        </div>
    );
}
