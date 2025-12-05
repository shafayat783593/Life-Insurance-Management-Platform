import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import {
    FaUser,
    FaEnvelope,
    FaImage,
    FaSave,
    FaCalendarAlt,
    FaShieldAlt,
    FaEdit,
    FaCamera,
    FaUpload,
    FaTrash,
    FaMoon,
    FaSun
} from "react-icons/fa";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import UseAuth from "../../Hooks/UseAuth";
import PageTitle from "../../Hooks/PageTItle";
import Loading from "../../components/Loader/Loading";

const EditProfile = () => {
    const { user, updateUser } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    // Dark mode state management
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        if (darkMode) {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    // Load user from database
    const { data: userData = {}, refetch, isLoading } = useQuery({
        queryKey: ["userData", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
        onSuccess: (data) => {
            setValue("name", data?.name || user?.displayName || "");
            setValue("photoURL", data?.photoURL || user?.photoURL || "");
            if (data?.photoURL) {
                setPreviewImage(data.photoURL);
            }
        },
    });

    // Image upload handler
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                title: "Invalid File!",
                text: "Please select an image file",
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                title: "File Too Large!",
                text: "Please select an image smaller than 5MB",
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
            return;
        }

        setUploading(true);

        try {
            // Create form data
            const formData = new FormData();
            formData.append('image', file);

            // Upload to ImgBB
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_UPLODE_KEY}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                const imageUrl = data.data.url;
                setValue("photoURL", imageUrl);
                setPreviewImage(imageUrl);

                Swal.fire({
                    title: "Success!",
                    text: "Image uploaded successfully",
                    icon: "success",
                    confirmButtonColor: "#10B981"
                });
            } else {
                throw new Error(data.error?.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            Swal.fire({
                title: "Upload Failed!",
                text: "Failed to upload image. Please try again.",
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Remove image handler
    const handleRemoveImage = () => {
        setValue("photoURL", "");
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Submit handler
    const onSubmit = async (data) => {
        try {
            // Update Firebase profile
            await updateUser(user, {
                displayName: data.name,
                photoURL: data.photoURL || userData?.photoURL,
            });

            // Update backend
            const res = await axiosSecure.patch(`/users/${user?.email}`, {
                name: data.name,
                photoURL: data.photoURL || userData?.photoURL,
                lastLogin: new Date().toISOString(),
            });

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    title: "Success!",
                    text: "Profile updated successfully",
                    icon: "success",
                    confirmButtonColor: "#10B981"
                });
                refetch();
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Profile update failed",
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
        }
    };

    if (isLoading) return <Loading />;

    return (
        <>
            <PageTitle title="User Profile" />

            <div className="min-h-screen  py-8 px-4 transition-colors duration-300">
                <div className="max-w-4xl mx-auto">
                    {/* Dark Mode Toggle */}
                  

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
                    >
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full border-4 border-white border-opacity-20 overflow-hidden">
                                        <img
                                            src={previewImage || userData?.photoURL || "https://i.ibb.co/G2L2GzJ/default-user.png"}
                                            className="w-full h-full object-cover"
                                            alt="User Profile"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                        <FaCamera className="text-white text-xl" />
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>

                                <div className="text-center md:text-left flex-1">
                                    <h1 className="text-2xl font-bold">{userData?.name || "User"}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">
                                            {userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1) || "User"}
                                        </span>
                                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                                            Member since {new Date(user?.metadata?.creationTime).getFullYear()}
                                        </span>
                                    </div>
                                    <p className="text-blue-100 mt-2 flex items-center justify-center md:justify-start gap-2">
                                        <FaCalendarAlt className="text-sm" />
                                        Last login: {new Date(user?.metadata?.lastSignInTime).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <FaEdit className="text-blue-500 text-xl" />
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Profile</h2>
                                </div>

                                {/* Image Upload Controls */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <FaUpload />
                                        )}
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                    </button>
                                    {(previewImage || userData?.photoURL) && (
                                        <button
                                            onClick={handleRemoveImage}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                        >
                                            <FaTrash />
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                                            <FaUser className="text-blue-500" />
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                {...register("name", {
                                                    required: "Name is required",
                                                    minLength: {
                                                        value: 2,
                                                        message: "Name must be at least 2 characters"
                                                    }
                                                })}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                                type="text"
                                                placeholder="Enter your full name"
                                            />
                                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                        {errors.name && (
                                            <p className="text-red-500 text-sm flex items-center gap-1">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field (Read-only) */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                                            <FaEnvelope className="text-green-500" />
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                value={user?.email}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                                type="email"
                                            />
                                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                                    </div>
                                </div>

                                {/* Photo URL Field */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                                        <FaImage className="text-purple-500" />
                                        Profile Photo URL
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register("photoURL", {
                                                pattern: {
                                                    value: /^https?:\/\/.+\..+/,
                                                    message: "Please enter a valid URL"
                                                }
                                            })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                            type="text"
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                        <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {errors.photoURL && (
                                        <p className="text-red-500 text-sm">{errors.photoURL.message}</p>
                                    )}
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Enter a valid image URL or upload an image above
                                    </p>
                                </div>

                                {/* Role Information */}
                                <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaShieldAlt className="text-blue-500" />
                                        <h3 className="font-semibold text-gray-800 dark:text-white">Account Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                <strong>Role:</strong> {userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1) || "User"}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                <strong>Account Created:</strong> {new Date(user?.metadata?.creationTime).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                <strong>Last Active:</strong> {new Date(user?.metadata?.lastSignInTime).toLocaleDateString()}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                <strong>Status:</strong> <span className="text-green-600 font-medium">Active</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting || uploading}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            Save Changes
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Quick Preview */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Profile Preview</h3>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={watch("photoURL") || previewImage || userData?.photoURL || "https://i.ibb.co/G2L2GzJ/default-user.png"}
                                            className="w-16 h-16 rounded-full border-2 border-white shadow"
                                            alt="Preview"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">
                                                {watch("name") || userData?.name || "Your Name"}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</p>
                                            <div className="mt-1">
                                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">
                                                    {userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1) || "User"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Additional Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <FaUser className="text-blue-600 dark:text-blue-400 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Profile Status</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-white">Complete</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <FaCalendarAlt className="text-green-600 dark:text-green-400 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                                        {new Date(user?.metadata?.creationTime).getFullYear()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <FaShieldAlt className="text-purple-600 dark:text-purple-400 text-lg" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Account Type</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-white capitalize">
                                        {userData?.role || "User"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfile;