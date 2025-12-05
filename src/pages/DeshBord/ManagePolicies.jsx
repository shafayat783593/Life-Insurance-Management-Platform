import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Swal from 'sweetalert2';
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaImage,
    FaFileAlt,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaUserShield
} from 'react-icons/fa';
import UseAuth from '../../Hooks/UseAuth';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import axios from 'axios';
import Loading from '../../components/Loader/Loading';
import PageTitle from '../../Hooks/PageTItle';

export default function ManagePolicies() {
    const { user } = UseAuth();
    const [editItem, setEditItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const axiosSecure = UseAxiosSecure();
    const [previewURL, setPreviewURL] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm();

    const { data: policies = [], refetch, isLoading } = useQuery({
        queryKey: ['policies'],
        queryFn: async () => {
            const res = await axiosSecure.get('/policies');
            return res.data;
        }
    });

    // Handle image upload
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview
        setPreviewURL(URL.createObjectURL(file));

        // Upload to ImgBB
        const formData = new FormData();
        formData.append('image', file);
        const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_UPLODE_KEY}`;

        try {
            const result = await axios.post(uploadUrl, formData);
            setProfilePic(result.data.data.url);
        } catch (error) {
            Swal.fire('Error', 'Failed to upload image', 'error');
        }
    };

    // Submit form
    const onSubmit = async (data) => {
        try {
            const policyData = {
                ...data,
                purchaseCount: 0,
                image: profilePic || editItem?.image,
            };

            if (editItem) {
                await axiosSecure.patch(`/policies/${editItem._id}`, policyData);
                Swal.fire('Updated!', 'Policy has been updated.', 'success');
            } else {
                await axiosSecure.post('/policies', policyData);
                Swal.fire('Created!', 'New policy added.', 'success');
            }

            setShowModal(false);
            setEditItem(null);
            setPreviewURL('');
            setProfilePic('');
            reset();
            refetch();
        } catch (err) {
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

    // Edit policy
    const handleEdit = (policy) => {
        setEditItem(policy);
        setValue('title', policy.title);
        setValue('category', policy.category);
        setValue('description', policy.description);
        setValue('minAge', policy.minAge);
        setValue('maxAge', policy.maxAge);
        setValue('coverageRange', policy.coverageRange);
        setValue('durationOptions', policy.durationOptions);
        setValue('baseRate', policy.baseRate);
        setPreviewURL(policy.image);
        setShowModal(true);
    };

    // Delete policy
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the policy.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            await axiosSecure.delete(`/policies/${id}`);
            Swal.fire('Deleted!', 'Policy deleted successfully.', 'success');
            refetch();
        }
    };

    // Close modal and reset
    const closeModal = () => {
        setShowModal(false);
        setEditItem(null);
        setPreviewURL('');
        setProfilePic('');
        reset();
    };

    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-base-100 p-4 md:p-6">
            <PageTitle title="Manage Policies" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary text-primary-content rounded-xl shadow-lg">
                            <FaUserShield className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-base-content">Manage Policies</h1>
                            <p className="text-base-content/70 mt-1">
                                {policies.length} policy{policies.length !== 1 ? 's' : ''} available
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary gap-2"
                    >
                        <FaPlus />
                        Add New Policy
                    </button>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block card bg-base-100 shadow-sm border  border-gray-500 mb-6">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th className="text-base-content font-semibold">Policy</th>
                                        <th className="text-base-content font-semibold">Category</th>
                                        <th className="text-base-content font-semibold">Age Range</th>
                                        <th className="text-base-content font-semibold">Coverage</th>
                                        <th className="text-base-content font-semibold">Duration</th>
                                        <th className="text-base-content font-semibold">Rate</th>
                                        <th className="text-base-content font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {policies?.map(policy => (
                                        <tr key={policy._id} className="hover:bg-base-200 transition-colors">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    {policy.image && (
                                                        <img
                                                            src={policy.image}
                                                            alt={policy.title}
                                                            className="w-10 h-10 rounded-lg object-cover"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-base-content">
                                                            {policy.title}
                                                        </div>
                                                        <div className="text-sm text-base-content/70">
                                                            {policy.description?.slice(0, 30)}...
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge ">
                                                    {policy.category}
                                                </span>
                                            </td>
                                            <td className="text-base-content">
                                                {policy.minAge} - {policy.maxAge} yrs
                                            </td>
                                            <td className="text-base-content">
                                                {policy.coverageRange}
                                            </td>
                                            <td className="text-base-content">
                                                {policy.durationOptions}
                                            </td>
                                            <td className="text-base-content font-semibold">
                                                ${policy.baseRate}
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(policy)}
                                                        className="btn btn-sm btn-outline btn-info gap-1"
                                                    >
                                                        <FaEdit />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(policy._id)}
                                                        className="btn btn-sm btn-outline btn-error gap-1"
                                                    >
                                                        <FaTrash />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden grid gap-4">
                    {policies?.map(policy => (
                        <div key={policy._id} className="card bg-base-100 shadow-sm border">
                            <div className="card-body">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {policy.image && (
                                            <img
                                                src={policy.image}
                                                alt={policy.title}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        )}
                                        <div>
                                            <h3 className="card-title text-base-content">
                                                {policy.title}
                                            </h3>
                                            <span className="badge badge-outline badge-sm">
                                                {policy.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                    <div>
                                        <p className="text-base-content/70">Age Range</p>
                                        <p className="font-semibold text-base-content">
                                            {policy.minAge} - {policy.maxAge} yrs
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-base-content/70">Coverage</p>
                                        <p className="font-semibold text-base-content">
                                            {policy.coverageRange}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-base-content/70">Duration</p>
                                        <p className="font-semibold text-base-content">
                                            {policy.durationOptions}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-base-content/70">Rate</p>
                                        <p className="font-semibold text-base-content">
                                            ${policy.baseRate}
                                        </p>
                                    </div>
                                </div>

                                <div className="card-actions justify-end">
                                    <button
                                        onClick={() => handleEdit(policy)}
                                        className="btn btn-sm btn-outline btn-info gap-1"
                                    >
                                        <FaEdit />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(policy._id)}
                                        className="btn btn-sm btn-outline btn-error gap-1"
                                    >
                                        <FaTrash />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
                                    <FaFileAlt className="text-primary" />
                                    {editItem ? 'Edit Policy' : 'Add New Policy'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="btn btn-sm btn-circle btn-ghost"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* Policy Title */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Policy Title</span>
                                    </label>
                                    <input
                                        {...register('title', { required: 'Title is required' })}
                                        className="input input-bordered"
                                        placeholder="Enter policy title"
                                    />
                                    {errors.title && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.title.message}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Category</span>
                                    </label>
                                    <input
                                        {...register('category', { required: 'Category is required' })}
                                        className="input input-bordered"
                                        placeholder="e.g., Health, Life, Auto"
                                    />
                                    {errors.category && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.category.message}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Age Range */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Min Age</span>
                                        </label>
                                        <input
                                            type="number"
                                            {...register('minAge', { required: 'Min age required' })}
                                            className="input input-bordered"
                                        />
                                        {errors.minAge && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.minAge.message}</span>
                                            </label>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Max Age</span>
                                        </label>
                                        <input
                                            type="number"
                                            {...register('maxAge', { required: 'Max age required' })}
                                            className="input input-bordered"
                                        />
                                        {errors.maxAge && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.maxAge.message}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Coverage & Duration */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Coverage Range</span>
                                        </label>
                                        <input
                                            {...register('coverageRange', { required: 'Coverage required' })}
                                            className="input input-bordered"
                                            placeholder="e.g., $50,000 - $1,000,000"
                                        />
                                        {errors.coverageRange && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.coverageRange.message}</span>
                                            </label>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Duration Options</span>
                                        </label>
                                        <input
                                            {...register('durationOptions', { required: 'Duration required' })}
                                            className="input input-bordered"
                                            placeholder="e.g., 1-30 years"
                                        />
                                        {errors.durationOptions && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.durationOptions.message}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Base Rate */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Base Rate ($)</span>
                                    </label>
                                    <input
                                        type="number"
                                        {...register('baseRate', { required: 'Base rate required' })}
                                        className="input input-bordered"
                                        placeholder="Enter base rate"
                                    />
                                    {errors.baseRate && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.baseRate.message}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Description</span>
                                    </label>
                                    <textarea
                                        {...register('description', { required: 'Description required' })}
                                        className="textarea textarea-bordered h-24"
                                        placeholder="Enter policy description..."
                                    />
                                    {errors.description && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.description.message}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Policy Image</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="file-input file-input-bordered"
                                    />
                                    {previewURL && (
                                        <div className="mt-2">
                                            <img
                                                src={previewURL}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover rounded-lg border"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="modal-action">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="btn btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary gap-2"
                                    >
                                        {editItem ? 'Update Policy' : 'Add Policy'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}