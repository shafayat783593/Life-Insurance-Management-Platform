import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Swal from 'sweetalert2';
import UseAuth from '../../Hooks/UseAuth';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import axios from 'axios';

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

    const { data: policies = [], refetch } = useQuery({
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
            console.error(err);
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

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Policies</h2>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">Add New Policy</button>
            </div>

            <div className="overflow-x-auto">
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
                                <td className="flex gap-2">
                                    <button onClick={() => handleEdit(policy)} className="btn btn-sm btn-info">Edit</button>
                                    <button onClick={() => handleDelete(policy._id)} className="btn btn-sm btn-error">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-md w-[600px] relative"
                        initial={{ scale: 0.7 }}
                        animate={{ scale: 1 }}
                    >
                        <h3 className="text-xl font-semibold mb-4">{editItem ? 'Edit Policy' : 'Add New Policy'}</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="label font-semibold">Policy Title</label>
                                <input {...register('title', { required: 'Title is required' })} className="input input-bordered w-full" />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className="label font-semibold">Category</label>
                                <input {...register('category', { required: 'Category is required' })} className="input input-bordered w-full" />
                                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                            </div>

                            <div>
                                <label className="label font-semibold">Minimum Age</label>
                                <input type="number" {...register('minAge', { required: 'Minimum age is required' })} className="input input-bordered w-full" />
                                {errors.minAge && <p className="text-red-500 text-sm">{errors.minAge.message}</p>}
                            </div>

                            <div>
                                <label className="label font-semibold">Maximum Age</label>
                                <input type="number" {...register('maxAge', { required: 'Maximum age is required' })} className="input input-bordered w-full" />
                                {errors.maxAge && <p className="text-red-500 text-sm">{errors.maxAge.message}</p>}
                            </div>

                            <div>
                                <label className="label font-semibold">Coverage Range</label>
                                <input {...register('coverageRange', { required: 'Coverage is required' })} className="input input-bordered w-full" />
                                {errors.coverageRange && <p className="text-red-500 text-sm">{errors.coverageRange.message}</p>}
                            </div>

                            <div>
                                <label className="label font-semibold">Duration Options</label>
                                <input {...register('durationOptions', { required: 'Duration is required' })} className="input input-bordered w-full" />
                                {errors.durationOptions && <p className="text-red-500 text-sm">{errors.durationOptions.message}</p>}
                            </div>

                            <div>
                                <label className="label font-semibold">Base Premium Rate</label>
                                <input type="number" {...register('baseRate', { required: 'Base rate is required' })} className="input input-bordered w-full" />
                                {errors.baseRate && <p className="text-red-500 text-sm">{errors.baseRate.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="label font-semibold">Policy Description</label>
                                <textarea
                                    {...register('description', { required: 'Description is required' })}
                                    className="textarea textarea-bordered w-full"
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="label font-semibold">Upload Policy Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="file-input file-input-bordered w-full"
                                />
                                {previewURL && (
                                    <img
                                        src={previewURL}
                                        alt="Preview"
                                        className="mt-2 w-24 h-24 object-cover rounded-lg border"
                                    />
                                )}
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                <button type="button" onClick={() => { setShowModal(false); reset(); setEditItem(null); }} className="btn">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
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
