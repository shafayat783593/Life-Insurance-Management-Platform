import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import UseAuth from '../../../Hooks/UseAuth'
import axios from 'axios'
import UseAxios from '../../../Hooks/UseAxious'
import { motion } from "framer-motion";
import SocialLogin from '../SocialLogin/SocialLogin'
import PageTitle from '../../../Hooks/PageTItle'
import Swal from 'sweetalert2'

// import "./Register.css"



function Register() {
    const { createrUser, updateUser, setuser, user } = UseAuth()
    const navigate = useNavigate()
    const location = useLocation()
    // const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState("");
    const [profilePic, setprofilePic] = useState("")
    const axiosIntences = UseAxios()
    // console.log(profilePic)

    // console.log(location)
    const from = location.state?.from?.pathname || "/";
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    // console.log(user)

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        setPreviewURL(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("image", file);
        const ImguplodUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_UPLODE_KEY}`
        const result = await axios.post(ImguplodUrl, formData)
        setprofilePic(result.data.data.url)


    };


    const onSubmit = async (data) => {
        try {
            const res = await createrUser(data.email, data.password);

            const userInfo = {
                email: data.email,
                role: "customer",
                name: data.name,
                photoURL: profilePic,
                created_at: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
            };

            const userResponse = await axiosIntences.post("/users", userInfo);

            const userProfile = {
                displayName: data?.name,
                photoURL: profilePic,
                email: data?.email,
            };

            await updateUser(userProfile);

            Swal.fire({
                icon: "success",
                title: "Registration Successful!",
                text: "Welcome aboard 🎉",
                confirmButtonColor: "#3085d6",
            }).then(() => {
                navigate(from);
            });

        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Registration failed. Please try again.", "error");
        }
    };

    // console.log(user)

    return (

        <>
            <PageTitle title="Register" /> 
        
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-5"
            >
                <h2 className="text-2xl font-bold text-start text-blue-600">Register</h2>

                {/* Name */}
                <div className="text-start">
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="input input-bordered w-full"
                        placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="text-start">
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className="input input-bordered w-full"
                        placeholder="email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Profile Photo */}
                <div className="text-start">
                    <label className="block font-medium mb-1">Profile Photo</label>
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
                            className="mt-2 w-24 h-24 object-cover rounded-full border"
                        />
                    )}
                </div>

                {/* Password */}
                <div className="text-start">
                    <label className="block font-medium mb-1">Password</label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                                message:
                                    "Password must include uppercase, lowercase and be at least 6 characters long.",
                            },
                        })}
                        className="input input-bordered w-full"
                        placeholder="********"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-full">
                    Register
                </button>
                <div className='text-2xl font-bold'>Or</div>
                <SocialLogin/>

                <p className="text-start text-sm">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </motion.div>
        </>
      );
}

export default Register
