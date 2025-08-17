import { useState } from "react";
import { Link, NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import UseAuth from "../../../Hooks/UseAuth";
import logo from "../../../assets/logo.png"
const Navbar = () => {
    const { user, logOut } = UseAuth()
    // console.log(user?.displayName)
    // console.log(user?.photoURL)
    const [isOpen, setIsOpen] = useState(false);



    const handleLogout = () => {
        logOut().then(() => {

        }).catch((error) => {

        });
    }



    const navLinks = (
        <>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive
                        ? "text-blue-500 font-semibold"
                        : "hover:text-blue-400 font-semibold "
                }
            >
                Home
            </NavLink>
            <NavLink
                to="/policies"
                className={({ isActive }) =>
                    isActive
                        ? "text-blue-500 font-semibold"
                        : "hover:text-blue-400 font-semibold"
                }
            >
                All Policies
            </NavLink>
            <NavLink
                to="/all-agents"
                className={({ isActive }) =>
                    isActive
                        ? "text-blue-500 font-semibold"
                        : "hover:text-blue-400"
                }
            >
                Agents
            </NavLink>
            <NavLink
                to="/faq"
                className={({ isActive }) =>
                    isActive
                        ? "text-blue-500 font-semibold"
                        : "hover:text-blue-400"
                }
            >
                FAQs
            </NavLink>

            {user && (
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-500 font-semibold"
                            : "hover:text-blue-400"
                    }
                >
                    Dashboard
                </NavLink>
            )}
        </>

    );

    return (
        <nav className="bg-base-100 shadow-md px-4 py-3 w-full fixed top-0 left-0 z-50">
            <div className="flex justify-between items-center w-11/12 mx-auto">

                
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-1">
                    <img className='w-15 rounded-full' src={logo} alt="" />  InsuranceCo
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6 ">
                    {navLinks}
                </div>









                {/* Right Side */}
                <div className="hidden md:flex items-center gap-4">

                    <div className='hidden lg:block'>




                        <label className="swap swap-rotate ">
                            {/* this hidden checkbox controls the state */}
                            <input type="checkbox" className="theme-controller" value="dark" />

                            {/* sun icon */}
                            <svg
                                className="swap-off h-10 w-10 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>

                            {/* moon icon */}
                            <svg
                                className="swap-on h-10 w-10 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                        </label>

                    </div>
                    {user ? (


                        <>

                     


                       

                            <Link to="/profile">
                                <img src={user?.photoURL} alt={user?.displayName} className="w-15 h-15 rounded-full" />
                            </Link>
                            <Link
                                to="/auth/login"
                                onClick={handleLogout}
                                className="cursor-pointer w-35 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all border-[1px] border-slate-500 group"
                            >
                                <div className="relative overflow-hidden">
                                    <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                        LogOut
                                    </p>
                                    <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                        LogOut
                                    </p>
                                </div>
                            </Link>



                        </>
                    ) : (
                        <>
                            <div className="flex gap-6">
                                <Link
                                    to="/auth/login"
                                    className="w-30 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent group"
                                >
                                    <div className="relative overflow-hidden">
                                        <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                            Login
                                        </p>
                                        <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                            Login
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/auth/register"
                                    className="w-35 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent group"
                                >
                                    <div className="relative overflow-hidden">
                                        <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                            Register
                                        </p>
                                        <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                            Register
                                        </p>
                                    </div>
                                </Link>
                            </div>


                            



                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex gap-10 justify-between items-center">
                    <Link to="/profile">
                        <img src={user?.photoURL} alt={user?.displayName} className="w-15 h-15 rounded-full" />
                    </Link>
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
                                <img className='w-15 rounded-full' src={logo} alt="" />  InsuranceCo
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

                            <div className='block lg:hidden'>




                                <label className="swap swap-rotate ">
                                    {/* this hidden checkbox controls the state */}
                                    <input type="checkbox" className="theme-controller" value="dark" />

                                    {/* sun icon */}
                                    <svg
                                        className="swap-off h-10 w-10 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                                    </svg>

                                    {/* moon icon */}
                                    <svg
                                        className="swap-on h-10 w-10 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                                    </svg>
                                </label>

                            </div>
                            <hr />
                            {user ? (
                                <>


                                    <Link
                                        to="/auth/login"
                                        onClick={handleLogout}
                                        className="cursor-pointer w-35+ px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all border-[1px] border-slate-500 group"
                                    >
                                        <div className="relative overflow-hidden">
                                            <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                                LogOut
                                            </p>
                                            <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                                LogOut
                                            </p>
                                        </div>
                                    </Link>



                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-6">
                                        <Link
                                            to="/auth/login"
                                            className="w-30 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent group"
                                        >
                                            <div className="relative overflow-hidden">
                                                <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                                    Login
                                                </p>
                                                <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                                    Login
                                                </p>
                                            </div>
                                        </Link>

                                        <Link
                                            to="/auth/register"
                                            className="w-35 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent group"
                                        >
                                            <div className="relative overflow-hidden">
                                                <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                                    Register
                                                </p>
                                                <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                                    Register
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                    {/* <NavLink
                                        to="/register"
                                        className={({ isActive }) =>
                                            isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400"
                                        }
                                    >
                                        Register
                                    </NavLink> */}






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
