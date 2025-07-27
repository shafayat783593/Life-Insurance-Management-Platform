import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Swal from 'sweetalert2';
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

    const { data: policies = [], refetch ,isLoading} = useQuery({
        queryKey: ['policies'],
        queryFn: async () => {
            const res = await axiosSecure.get('/policies');
            return res.data;
        }
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setPreviewURL(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('image', file);
        const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_UPLODE_KEY}`;
        const result = await axios.post(uploadUrl, formData);
        setProfilePic(result.data.data.url);
    };

    const onSubmit = async (data) => {
        try {
            const dataInfo = {
                ...data,
                purchaseCount:0,
                image: profilePic,
            };

            if (editItem) {
                await axiosSecure.patch(`/policies/${editItem._id}`, dataInfo);
                Swal.fire('Updated!', 'Policy has been updated.', 'success');
            } else {
                await axiosSecure.post('/policies', dataInfo);
                Swal.fire('Created!', 'New policy added.', 'success');
            }

            setShowModal(false);
            setEditItem(null);
            reset();
            refetch();
        } catch (err) {
            // console.error(err);
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

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
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will delete the policy.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            await axiosSecure.delete(`/policies/${id}`);
            Swal.fire('Deleted!', 'Policy deleted successfully.', 'success');
            refetch();
        }
    };

    if(isLoading) return <Loading/>

    return (
        <div className="p-6">
            <PageTitle title="Manage policies" /> 
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Policies</h2>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">Add New Policy</button>
            </div>
            {/* Table for desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Age</th>
                            <th>Coverage</th>
                            <th>Duration</th>
                            <th>Rate</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies?.map(policy => (
                            <tr key={policy._id}>
                                <td>{policy.title}</td>
                                <td>{policy.category}</td>
                                <td>{policy.minAge}–{policy.maxAge}</td>
                                <td>{policy.coverageRange}</td>
                                <td>{policy.durationOptions}</td>
                                <td>{policy.baseRate}</td>
                                <td className="flex flex-wrap gap-2">
                                    <button onClick={() => handleEdit(policy)} className="btn btn-sm btn-info">Edit</button>
                                    <button onClick={() => handleDelete(policy._id)} className="btn btn-sm btn-error">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cards for mobile/tablet */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {policies?.map(policy => (
                    <div key={policy._id} className="bg-white shadow rounded-lg p-4 border">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{policy.title}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(policy)} className="btn btn-sm btn-info">Edit</button>
                                <button onClick={() => handleDelete(policy._id)} className="btn btn-sm btn-error">Delete</button>
                            </div>
                        </div>
                        <p><strong>Category:</strong> {policy.category}</p>
                        <p><strong>Age:</strong> {policy.minAge}–{policy.maxAge}</p>
                        <p><strong>Coverage:</strong> {policy.coverageRange}</p>
                        <p><strong>Duration:</strong> {policy.durationOptions}</p>
                        <p><strong>Rate:</strong> {policy.baseRate}</p>
                    </div>
                ))}
            </div>


            {/* Modal */}
            {/* Modal */}
            {showModal && (
                <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <motion.div
                        className="bg-white p-4 md:p-6 rounded-xl shadow-md w-full max-w-md md:max-w-2xl relative overflow-y-auto max-h-[90vh]"
                        initial={{ scale: 0.7 }}
                        animate={{ scale: 1 }}
                    >
                        <h3 className="text-lg md:text-xl font-semibold mb-4">
                            {editItem ? 'Edit Policy' : 'Add New Policy'}
                        </h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3">
                            {/* Title */}
                            <div>
                                <label className="label font-semibold text-sm">Policy Title</label>
                                <input {...register('title', { required: 'Title is required' })} className="input input-bordered w-full text-sm" />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="label font-semibold text-sm">Category</label>
                                <input {...register('category', { required: 'Category is required' })} className="input input-bordered w-full text-sm" />
                                {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                            </div>

                            {/* Min & Max Age */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="label font-semibold text-sm">Min Age</label>
                                    <input type="number" {...register('minAge', { required: 'Min age required' })} className="input input-bordered w-full text-sm" />
                                    {errors.minAge && <p className="text-red-500 text-xs">{errors.minAge.message}</p>}
                                </div>
                                <div>
                                    <label className="label font-semibold text-sm">Max Age</label>
                                    <input type="number" {...register('maxAge', { required: 'Max age required' })} className="input input-bordered w-full text-sm" />
                                    {errors.maxAge && <p className="text-red-500 text-xs">{errors.maxAge.message}</p>}
                                </div>
                            </div>

                            {/* Coverage */}
                            <div>
                                <label className="label font-semibold text-sm">Coverage Range</label>
                                <input {...register('coverageRange', { required: 'Coverage required' })} className="input input-bordered w-full text-sm" />
                                {errors.coverageRange && <p className="text-red-500 text-xs">{errors.coverageRange.message}</p>}
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="label font-semibold text-sm">Duration</label>
                                <input {...register('durationOptions', { required: 'Duration required' })} className="input input-bordered w-full text-sm" />
                                {errors.durationOptions && <p className="text-red-500 text-xs">{errors.durationOptions.message}</p>}
                            </div>

                            {/* Rate */}
                            <div>
                                <label className="label font-semibold text-sm">Base Rate</label>
                                <input type="number" {...register('baseRate', { required: 'Base rate required' })} className="input input-bordered w-full text-sm" />
                                {errors.baseRate && <p className="text-red-500 text-xs">{errors.baseRate.message}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="label font-semibold text-sm">Description</label>
                                <textarea {...register('description', { required: 'Description required' })} className="textarea textarea-bordered w-full text-sm" />
                                {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="label font-semibold text-sm">Policy Image</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="file-input file-input-bordered w-full text-sm" />
                                {previewURL && (
                                    <img src={previewURL} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-md border" />
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => { setShowModal(false); reset(); setEditItem(null); }} className="btn btn-sm">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-sm btn-primary">
                                    {editItem ? "Update" : "Add Policy"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}

        </div>
    );
}
