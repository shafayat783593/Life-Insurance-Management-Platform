import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import UseAuth from "../../../Hooks/UseAuth";
import SocialLogin from "../SocialLogin/SocialLogin";
import PageTitle from "../../../Hooks/PageTItle";

const Login = () => {
    const { signin } = UseAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.from?.pathname || "/";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async ({ email, password }) => {
        try {
            await signin(email, password);
            Swal.fire({
                icon: "success",
                title: "Login Successful!",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate(redirectPath);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: err.message,
            });
        }
    };

    const handleForget = () => {
        navigate("/auth/forget");
    };

    return (

        <>
            <PageTitle title="Login" />
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
                    <h2 className="text-2xl font-bold text-center text-blue-600">Login</h2>

                    {/* Email */}
                    <div className="text-start">
                        <label className="block font-medium mb-1">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className="input input-bordered w-full"
                            placeholder="email@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">Email is required</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="text-start">
                        <label className="block font-medium mb-1">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: true })}
                            className="input input-bordered w-full"
                            placeholder="********"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">Password is required</p>
                        )}
                    </div>
                    <button className=" text-blue-500 cursor-pointer font-bold" onClick={handleForget}>ForgetPassword</button>
             
                    <button type="submit" className="btn btn-primary w-full">
                        Login
                    </button>

                    {/* Google Login */}
                    <div className='text-2xl font-bold'>Or</div>


                    <SocialLogin />
                    {/* Register Redirect */}
                    <p className="text-center text-sm">
                        Don’t have an account?{" "}
                        <Link
                            to="/auth/register"
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </motion.div>
        </>
    );
};

export default Login;
