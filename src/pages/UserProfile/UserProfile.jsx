import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import Swal from "sweetalert2";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import UseAuth from "../../Hooks/UseAuth";
import PageTitle from "../../Hooks/PageTItle";

const EditProfile = () => {
    const { user, updateUser } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // 1. Load user from database (MongoDB)
    const { data: userData = {}, refetch } = useQuery({
        queryKey: ["userData", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        },



        enabled: !!user?.email,
        onSuccess: (data) => {
            setValue("name", data?.name || user?.displayName || "");
            setValue("photoURL", user?.photoURL || "");
        },
    });
    console.log(userData)
    // 2. Submit handler
    const onSubmit = async (data) => {
        try {
            // Update Firebase profile
            await updateUser(user, {
                displayName: data.name,
                photoURL: data.photoURL,
            });

            // Update backend
            const res = await axiosSecure.patch(`/users/${user?.email}`, {
                name: data.name,
                photoURL: data.photoURL,
                lastLogin: new Date().toISOString(),
            });

            if (res.data.modifiedCount > 0) {
                Swal.fire("Success", "Profile updated", "success");
                refetch()

            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Profile update failed", "error");
        }

    };

    // 3. Role Badge Component
    const getRoleBadge = (role) => {
        if (role === "admin") return <span className="badge badge-error">Admin</span>;
        if (role === "agent") return <span className="badge badge-warning">Agent</span>;
        return <span className="badge badge-info">Customer</span>;
    };

    return (

        <>
            <PageTitle title="User Profile" />
            <div className="max-w-lg mx-auto px-4 mt-20 py-6 bg-white shadow rounded">


                <div className="text-center mb-4">
                    <img
                        src={userData?.photoURL || "https://i.ibb.co/G2L2GzJ/default-user.png"}
                        className="w-24 h-24 rounded-full mx-auto border"
                        alt="User"
                    />
                    <h2 className="text-xl font-semibold mt-2">{userData.name || "User"}</h2>
                    <div className="mt-1">{getRoleBadge(userData?.role)}</div>
                    <p className="text-sm text-gray-500 mt-1">
                        Last login: {new Date(user?.metadata?.lastSignInTime).toLocaleString()}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block font-medium">Name</label>
                        <input
                            defaultValue={userData?.name}
                            {...register("name", { required: true })}
                            className="w-full input input-bordered"
                            type="text"
                        />
                        {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
                    </div>

                    {/* Photo URL */}
                    <div>
                        <label className="block font-medium">Photo URL</label>
                        <input
                            defaultValue={userData?.photoURL}
                            {...register("photoURL")}
                            className="w-full input input-bordered"
                            type="text"
                        />
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            value={user?.email}
                            readOnly
                            className="w-full input input-bordered bg-gray-100"
                            type="email"
                        />
                    </div>

                    {/* Submit */}
                    <button className="btn btn-primary w-full" type="submit">
                        Save Profile
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditProfile;
