import React from 'react'
import { useLocation, useNavigate } from 'react-router';
import UseAuth from '../../../Hooks/UseAuth';
import Swal from 'sweetalert2';
import UseAxios from '../../../Hooks/UseAxious';
import { FcGoogle } from "react-icons/fc";

function SocialLogin() {
    const { googleLogin } = UseAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const axiosIntences = UseAxios()

    const handleGoogleLogin = async () => {
        try {
            const res = await googleLogin();
            const user = res.user;

            const userInfo = {
                email: user.email,
                name: user.displayName,
                role: "customer",
                created_at: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            await axiosIntences.post("/users", userInfo);

            Swal.fire({
                icon: "success",
                title: "Google Login Successful!",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate(from);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Google Login Failed",
                text: err.message,
            });
        }
    };

    return (
        <div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="btn btn-outline w-full flex items-center justify-center gap-2"
            >
                <FcGoogle className="text-xl" /> Login with Google
            </button>

        </div>
    )
}

export default SocialLogin
