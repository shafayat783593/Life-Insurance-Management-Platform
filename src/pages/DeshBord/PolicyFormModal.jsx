import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PolicyFormModal({ setShowModal, editingPolicy, queryClient }) {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: editingPolicy || {},
    });

    const onSubmit = async (data) => {
        if (editingPolicy) {
            await axios.put(`/assing/api/policies/${editingPolicy._id}`, data);
            Swal.fire('Updated!', 'Policy updated successfully.', 'success');
        } else {
            await axios.post('/assing/api/policies', data);
            Swal.fire('Added!', 'Policy added successfully.', 'success');
        }
        queryClient.invalidateQueries(['policies']);
        setShowModal(false);
        reset();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4">
                    {editingPolicy ? 'Edit Policy' : 'Add New Policy'}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <input {...register('title')} className="input input-bordered w-full" placeholder="Policy Title" />
                    <input {...register('category')} className="input input-bordered w-full" placeholder="Category" />
                    <textarea {...register('description')} className="textarea textarea-bordered w-full" placeholder="Description" />
                    <div className="flex gap-2">
                        <input {...register('minAge')} type="number" className="input input-bordered w-full" placeholder="Min Age" />
                        <input {...register('maxAge')} type="number" className="input input-bordered w-full" placeholder="Max Age" />
                    </div>
                    <input {...register('coverageRange')} className="input input-bordered w-full" placeholder="Coverage Range" />
                    <input {...register('durationOptions')} className="input input-bordered w-full" placeholder="Duration Options (e.g. 10, 20)" />
                    <input {...register('basePremiumRate')} type="number" className="input input-bordered w-full" placeholder="Base Premium Rate" />
                    <input {...register('image')} className="input input-bordered w-full" placeholder="Policy Image URL" />

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary">{editingPolicy ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
