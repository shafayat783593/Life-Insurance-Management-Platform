import { useState } from "react";
import Swal from "sweetalert2";
import UseAuth from "../Hooks/UseAuth";
import { NavLink } from "react-router";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const { forgetPassword } = UseAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            return Swal.fire("Error", "Please enter your email.", "error");
        }

        try {
            await forgetPassword(email);
            Swal.fire("Success", "Password reset email sent!", "success");
            setEmail("");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to send reset email.", "error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Enter your registered email"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Send Reset Email
                    </button>
                </form>
                <NavLink
                    to="/auth/login"
                    className="px-4 flex justify-center items-center text-center my-5 sm:px-8 py-1 w-40 ml-30  sm:py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg font-semibold text-sm sm:text-lg shadow-md hover:shadow-xl transition-all"
                >
                   Go Back
                </NavLink>
            </div>
        </div>
    );
};

export default ForgotPassword;
