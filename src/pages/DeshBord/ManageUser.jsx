import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaUserShield, FaUserTie, FaTrashAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';

export default function ManageUsers() {
    const axiosSecure= UseAxiosSecure()
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    const updateRole = async (id, role) => {
        try {
            await axiosSecure.patch(`/api/users/role/${id}`, { role });
            Swal.fire('Success!', `User role changed to ${role}`, 'success');
            refetch();
        } catch (err) {
            Swal.fire('Error', 'Failed to change role', 'error');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Registered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <motion.tr key={user._id} whileHover={{ scale: 1.01 }}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.role === 'admin' ? 'badge-error' : user.role === 'agent' ? 'badge-info' : 'badge-success'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="flex gap-2">
                                    {user.role === 'customer' && (
                                        <button onClick={() => updateRole(user._id, 'agent')} className="btn btn-sm btn-info flex items-center gap-1">
                                            <FaUserTie /> Promote
                                        </button>
                                    )}
                                    {user.role === 'agent' && (
                                        <button onClick={() => updateRole(user._id, 'customer')} className="btn btn-sm btn-warning flex items-center gap-1">
                                            <FaUserShield /> Demote
                                        </button>
                                    )}
                                    {/* Optional delete button */}
                                    {/* <button className="btn btn-sm btn-error"><FaTrashAlt /></button> */}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
