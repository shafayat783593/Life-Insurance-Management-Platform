import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    FaUserTie,
    FaUserShield,
    FaTrashAlt,
    FaFilter,
    FaUser,
    FaEnvelope,
    FaCalendar,
    FaUserCog,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import Loading from '../../components/Loader/Loading';
import PageTitle from '../../Hooks/PageTItle';

export default function ManageUsers() {
    const axiosSecure = UseAxiosSecure();
    const [filter, setFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    const updateRole = async (id, role, userName) => {
        const result = await Swal.fire({
            title: 'Confirm Role Change',
            text: `Are you sure you want to change ${userName}'s role to ${role}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
            customClass: {
                popup: 'border-2 border-blue-500'
            }
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/role/${id}`, { role });
                Swal.fire({
                    title: 'Updated!',
                    text: `${userName}'s role changed to ${role}`,
                    icon: 'success',
                    customClass: {
                        popup: 'border-2 border-green-500'
                    }
                });
                refetch();
            } catch (err) {
                Swal.fire({
                    title: 'Error',
                    text: 'Role update failed',
                    icon: 'error',
                    customClass: {
                        popup: 'border-2 border-red-500'
                    }
                });
            }
        }
    };

    const deleteUser = async (id, userName) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `${userName} will be deleted permanently! This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'border-2 border-red-500'
            }
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/users/${id}`);
                Swal.fire({
                    title: 'Deleted!',
                    text: `${userName} has been removed.`,
                    icon: 'success',
                    customClass: {
                        popup: 'border-2 border-green-500'
                    }
                });
                refetch();
            } catch (err) {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete user',
                    icon: 'error',
                    customClass: {
                        popup: 'border-2 border-red-500'
                    }
                });
            }
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'border-red-500 text-red-700 bg-red-50';
            case 'agent': return 'border-blue-500 text-blue-700 bg-blue-50';
            case 'customer': return 'border-green-500 text-green-700 bg-green-50';
            default: return 'border-gray-500 text-gray-700 bg-gray-50';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <FaUserShield className="text-red-500" />;
            case 'agent': return <FaUserTie className="text-blue-500" />;
            case 'customer': return <FaUser className="text-green-500" />;
            default: return <FaUser className="text-gray-500" />;
        }
    };

    // Sort users based on sortOrder
    const sortedUsers = [...users].sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        } else if (sortOrder === 'oldest') {
            return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        }
        return 0;
    });

    const filteredUsers = filter === 'all'
        ? sortedUsers
        : sortedUsers.filter(user => user.role === filter);

    if (isLoading) return <Loading />;

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <PageTitle title="Manage Users" />

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
                    <FaUserCog className="text-blue-500" /> Manage Users
                </h1>
                <p className="text-gray-600 mb-6">Manage user roles and permissions across the platform</p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-blue-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-700">Total Users</h3>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                            <FaUser className="text-3xl text-blue-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-green-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-green-700">Customers</h3>
                                <p className="text-2xl font-bold">{users.filter(u => u.role === 'customer').length}</p>
                            </div>
                            <FaUser className="text-3xl text-green-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-blue-400 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-600">Agents</h3>
                                <p className="text-2xl font-bold">{users.filter(u => u.role === 'agent').length}</p>
                            </div>
                            <FaUserTie className="text-3xl text-blue-400" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-red-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-red-700">Admins</h3>
                                <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                            </div>
                            <FaUserShield className="text-3xl text-red-500" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Control Panel */}
            <div className="rounded-xl border-2 border-gray-200 shadow-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <FaFilter className="text-gray-500" />
                            <label className="text-sm font-medium text-gray-700">Filter by Role:</label>
                        </div>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg border-2 ${filter === 'all' ? 'border-blue-500 text-blue-600 font-semibold' : 'border-gray-300 text-gray-600'}`}
                            >
                                All ({users.length})
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilter('admin')}
                                className={`px-4 py-2 rounded-lg border-2 ${filter === 'admin' ? 'border-red-500 text-red-600 font-semibold' : 'border-gray-300 text-gray-600'}`}
                            >
                                Admin ({users.filter(u => u.role === 'admin').length})
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilter('agent')}
                                className={`px-4 py-2 rounded-lg border-2 ${filter === 'agent' ? 'border-blue-500 text-blue-600 font-semibold' : 'border-gray-300 text-gray-600'}`}
                            >
                                Agent ({users.filter(u => u.role === 'agent').length})
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilter('customer')}
                                className={`px-4 py-2 rounded-lg border-2 ${filter === 'customer' ? 'border-green-500 text-green-600 font-semibold' : 'border-gray-300 text-gray-600'}`}
                            >
                                Customer ({users.filter(u => u.role === 'customer').length})
                            </motion.button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Sort by Date:</label>
                        <select
                            className="select select-bordered select-sm border-2 border-gray-300"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Desktop Table View (Only this view) */}
            <div className="overflow-x-auto rounded-xl border-2 border-gray-200 shadow-lg">
                <table className="table w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="font-bold text-gray-700">User Information</th>
                            <th className="font-bold text-gray-700">Role</th>
                            <th className="font-bold text-gray-700">
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                                    className="flex items-center gap-2 hover:text-blue-600"
                                >
                                    Registration Date
                                    {sortOrder === 'newest' ?
                                        <FaArrowDown className="text-sm" /> :
                                        <FaArrowUp className="text-sm" />
                                    }
                                </button>
                            </th>
                            <th className="font-bold text-gray-700 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <motion.tr
                                key={user._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    borderLeft: "4px solid #3b82f6"
                                }}
                                className="border-b border-gray-100"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {user.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full border-2 border-gray-300"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                                <FaUser className="text-gray-500" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaEnvelope className="text-xs" />
                                                <span className="truncate max-w-xs">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 ${getRoleBadgeClass(user.role)}`}>
                                        {getRoleIcon(user.role)}
                                        <span className="font-semibold capitalize">{user.role}</span>
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaCalendar />
                                        <span>
                                            {user.created_at
                                                ? new Date(user.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-3">
                                        {user.role !== 'admin' && (
                                            <>
                                                {user.role === 'customer' ? (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => updateRole(user._id, 'agent', user.name)}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-blue-500 text-blue-600 hover:shadow-lg transition-shadow"
                                                    >
                                                        <FaUserTie /> Promote to Agent
                                                    </motion.button>
                                                ) : user.role === 'agent' ? (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => updateRole(user._id, 'customer', user.name)}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-yellow-500 text-yellow-600 hover:shadow-lg transition-shadow"
                                                    >
                                                        <FaUserShield /> Demote to Customer
                                                    </motion.button>
                                                ) : null}

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => deleteUser(user._id, user.name)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-red-500 text-red-600 hover:shadow-lg transition-shadow"
                                                >
                                                    <FaTrashAlt /> Delete
                                                </motion.button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">👤</div>
                        <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
                        <p className="text-gray-600">No users match the selected filter criteria.</p>
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border-2 border-gray-300">
                    <div className="text-sm font-semibold text-gray-700">Showing</div>
                    <div className="text-xl font-bold">{filteredUsers.length} of {users.length} users</div>
                </div>

                <div className="p-4 rounded-xl border-2 border-gray-300">
                    <div className="text-sm font-semibold text-gray-700">Current Filter</div>
                    <div className="text-xl font-bold capitalize">{filter === 'all' ? 'All Users' : filter}</div>
                </div>

                <div className="p-4 rounded-xl border-2 border-gray-300">
                    <div className="text-sm font-semibold text-gray-700">Last Updated</div>
                    <div className="text-xl font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>

            {/* Important Note */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 rounded-xl border-2 border-yellow-500 shadow-lg"
            >
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full border-2 border-yellow-500">
                        <FaUserShield className="text-xl text-yellow-500" />
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-yellow-700 mb-2">Important Notes</h4>
                        <ul className="text-gray-600 space-y-1 text-sm">
                            <li>• Admin users cannot be modified or deleted for security reasons</li>
                            <li>• Promoting a user to Agent will grant them additional permissions</li>
                            <li>• Deleting a user will permanently remove all their data</li>
                            <li>• Role changes take effect immediately</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}