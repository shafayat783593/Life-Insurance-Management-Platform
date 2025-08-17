import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import UseAuth from "../../../Hooks/UseAuth";
import logo from "../../../assets/logo.png";

const Navbar = () => {
    const { user, logOut } = UseAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    
    useEffect(() => {
        document.querySelector("html").setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    const handleLogout = () => {
        logOut().catch((error) => console.log(error));
    };

    const navLinks = (
        <>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400 font-semibold"
                }
            >
                Home
            </NavLink>
            <NavLink
                to="/policies"
                className={({ isActive }) =>
                    isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400 font-semibold"
                }
            >
                All Policies
            </NavLink>
            <NavLink
                to="/all-agents"
                className={({ isActive }) =>
                    isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400 font-semibold"
                }
            >
                Agents
            </NavLink>
            <NavLink
                to="/faq"
                className={({ isActive }) =>
                    isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400 font-semibold"
                }
            >
                FAQs
            </NavLink>
            {user && (
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400 font-semibold"
                    }
                >
                    Dashboard
                </NavLink>
            )}
        </>
    );

    return (
        <nav className="bg-base-100 shadow-md px-4 py-4 w-full fixed top-0 left-0 z-50">
            <div className="flex justify-between items-center w-11/12 mx-auto">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-1">
                    <img className="w-10 h-10 rounded-full" src={logo} alt="logo" /> InsuranceCo
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">{navLinks}</div>

                {/* Right Side Desktop */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Dark Mode Toggle */}
                    <label className="swap swap-rotate">
                        {/* Theme Toggle Checkbox */}
                        <input
                            type="checkbox"
                            checked={theme === "dark"}
                            onChange={() => setTheme(theme === "light" ? "dark" : "light")}
                        />

                        {/* Sun Icon (Visible in Light mode) */}
                        <svg
                            className="swap-off h-8 w-8 fill-current text-yellow-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M5.64 17l-.71.71a1 1 0 101.41 1.41l.71-.71A9 9 0 115.64 17zM12 20a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>

                        {/* Moon Icon (Visible in Dark mode) */}
                        <svg
                            className="swap-on h-8 w-8 fill-current text-blue-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M21.64 13a1 1 0 00-1.05-.14A8 8 0 1112.18 3.4a1 1 0 00-.14-1.05A10 10 0 1021.64 13z" />
                        </svg>
                    </label>


                    {/* Auth Buttons */}
                    {user ? (
                        <>
                            <Link to="/profile">
                                <img src={user?.photoURL} alt={user?.displayName} className="w-15 h-15 rounded-full" />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-35 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent group"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                          
                            <Link
                                to="/auth/login"
                                    className="w-35 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent group"
                            >
                            Login
                            </Link>
                            <Link
                                to="/auth/register"
                                    className="w-35 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent group"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-3">
                    {user && (
                        <Link to="/profile">
                            <img src={user?.photoURL} alt={user?.displayName} className="w-10 h-10 rounded-full" />
                        </Link>
                    )}
                    <button onClick={() => setIsOpen(true)} className="focus:outline-none">
                        <svg className="w-7 h-7 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-0 left-0 w-64 h-full bg-base-100 shadow-lg z-50 p-6 space-y-6 md:hidden"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-1">
                                    <img className="w-10 h-10 rounded-full" src={logo} alt="logo" /> InsuranceCo
                                </Link>
                                <button onClick={() => setIsOpen(false)} className=" hover:text-red-500">
                                    ✕
                                </button>
                            </div>

                            {/* Links */}
                            <div onClick={() => setIsOpen(false)} className="flex flex-col space-y-4">
                                {navLinks}
                                <hr />

                                {/* Dark Mode Mobile */}
                                <label className="swap swap-rotate">
                                    {/* Theme Toggle Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={theme === "dark"}
                                        onChange={() => setTheme(theme === "light" ? "dark" : "light")}
                                    />

                                    {/* Sun Icon (Visible in Light mode) */}
                                    <svg
                                        className="swap-off h-8 w-8 fill-current text-yellow-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M5.64 17l-.71.71a1 1 0 101.41 1.41l.71-.71A9 9 0 115.64 17zM12 20a8 8 0 100-16 8 8 0 000 16z" />
                                    </svg>

                                    {/* Moon Icon (Visible in Dark mode) */}
                                    <svg
                                        className="swap-on h-8 w-8 fill-current text-blue-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M21.64 13a1 1 0 00-1.05-.14A8 8 0 1112.18 3.4a1 1 0 00-.14-1.05A10 10 0 1021.64 13z" />
                                    </svg>
                                </label>


                                <hr />

                                {/* Auth Mobile */}
                                {user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="px-7 py-4 cursor-pointerbg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-md hover:shadow-xl transition-all"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <Link
                                            to="/auth/login"
                                                className="w-35 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent group"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/auth/register"
                                                className="w-35 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent group"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
