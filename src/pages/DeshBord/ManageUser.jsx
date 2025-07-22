import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import Swal from 'sweetalert2';
import { FaUserTie, FaUserShield, FaTrashAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Loading from '../../components/Loader/Loading';

export default function ManageUsers() {
    const axiosSecure = UseAxiosSecure();
    const [filter, setFilter] = useState('all');

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    const updateRole = async (id, role) => {
        try {
            await axiosSecure.patch(`/role/${id}`, { role });
            Swal.fire('Updated!', `Role changed to ${role}`, 'success');
            refetch();
        } catch (err) {
            Swal.fire('Error', 'Role update failed', 'error');
        }
    };

    const deleteUser = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This user will be deleted permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                await axiosSecure.delete(`/users/${id}`);
                Swal.fire('Deleted!', 'User has been removed.', 'success');
                refetch();
            } catch (err) {
                Swal.fire('Error', 'Failed to delete user', 'error');
            }
        }
    };

    const filteredUsers =
        filter === 'all' ? users : users.filter((u) => u.role === filter);

    if (isLoading) return <Loading />;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

            {/* Filter Dropdown */}
            <div className="mb-4">
                <select
                    className="select w-34 select-bordered select-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                    <option value="customer">Customer</option>
                </select>
            </div>

            {/* Table on md+ */}
            <div className="hidden md:block">
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
                        {filteredUsers.map((user) => (
                            <motion.tr key={user._id} whileHover={{ scale: 1.01 }}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span
                                        className={`badge ${user.role === 'admin'
                                            ? 'badge-error'
                                            : user.role === 'agent'
                                                ? 'badge-info'
                                                : 'badge-success'
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    {user.created_at
                                        ? new Date(user.created_at).toLocaleDateString()
                                        : 'N/A'}
                                </td>
                                <td className="flex flex-wrap gap-2">
                                    {user.role === 'customer' && (
                                        <button
                                            onClick={() => updateRole(user._id, 'agent')}
                                            className="btn btn-sm btn-info flex items-center gap-1"
                                        >
                                            <FaUserTie /> Promote
                                        </button>
                                    )}
                                    {user.role === 'agent' && (
                                        <button
                                            onClick={() => updateRole(user._id, 'customer')}
                                            className="btn btn-sm btn-warning flex items-center gap-1"
                                        >
                                            <FaUserShield /> Demote
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card view on mobile */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {filteredUsers.map((user) => (
                    <motion.div
                        key={user._id}
                        className="card bg-base-100 shadow-md p-4 space-y-2"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="text-lg font-semibold">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div>
                            <span
                                className={`badge ${user.role === 'admin'
                                    ? 'badge-error'
                                    : user.role === 'agent'
                                        ? 'badge-info'
                                        : 'badge-success'
                                    }`}
                            >
                                {user.role}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Registered:{' '}
                            {user.created_at
                                ? new Date(user.created_at).toLocaleDateString()
                                : 'N/A'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {user.role === 'customer' && (
                                <button
                                    onClick={() => updateRole(user._id, 'agent')}
                                    className="btn btn-sm btn-info"
                                >
                                    <FaUserTie /> Promote
                                </button>
                            )}
                            {user.role === 'agent' && (
                                <button
                                    onClick={() => updateRole(user._id, 'customer')}
                                    className="btn btn-sm btn-warning"
                                >
                                    <FaUserShield /> Demote
                                </button>
                            )}
                            <button
                                onClick={() => deleteUser(user._id)}
                                className="btn btn-sm btn-error"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
