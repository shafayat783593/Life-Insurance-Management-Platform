import { useState } from "react";
import { Link, NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import UseAuth from "../../../Hooks/UseAuth";

const Navbar = () => {
    const { user, logOut } = UseAuth()
    console.log(user?.displayName)
    const [isOpen, setIsOpen] = useState(false);

    // Simulated user auth (replace with your logic)
    // const user = { email: "user@example.com", name: "John Doe" };
    // const user = null;

    const navLinks = (
        <>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                }
            >
                Home
            </NavLink>
            <NavLink
                to="/policies"
                className={({ isActive }) =>
                    isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                }
            >
                All Policies
            </NavLink>
            <NavLink
                to="/agents"
                className={({ isActive }) =>
                    isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                }
            >
                Agents
            </NavLink>
            <NavLink
                to="/faqs"
                className={({ isActive }) =>
                    isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                }
            >
                FAQs
            </NavLink>

            {user && (
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                    }
                >
                    Dashboard
                </NavLink>
            )}
        </>
    );

    return (
        <nav className="bg-white shadow-md px-4 py-3 w-full fixed top-0 left-0 z-50">
            <div className="flex justify-between items-center w-full">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-1">
                    <span role="img" aria-label="map">🗺</span> InsuranceCo
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6 text-gray-700">
                    {navLinks}
                </div>

                {/* Right Side */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                            }
                        >
                            {user.displayName}
                        </NavLink>
                    ) : (
                        <>
                            <NavLink
                                to="/auth/login"
                                className={({ isActive }) =>
                                    isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                                }
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/auth/register"
                                className={({ isActive }) =>
                                    isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                                }
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(true)} className="focus:outline-none">
                        <svg
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Slide-in */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-6 space-y-4 text-gray-800 md:hidden"
                    >
                        {/* Close Button */}
                        <div className="flex justify-between items-center mb-4">
                            <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-1">
                                🗺 InsuranceCo
                            </Link>
                            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-red-500">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile Links */}
                        <div onClick={() => setIsOpen(false)} className="flex flex-col space-y-3">
                            {navLinks}
                            <hr />
                            {user ? (
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                                    }
                                >
                                    {user.name}
                                </NavLink>
                            ) : (
                                <>
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                                        }
                                    >
                                        Login
                                    </NavLink>
                                    <NavLink
                                        to="/register"
                                        className={({ isActive }) =>
                                            isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                                        }
                                    >
                                        Register
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
