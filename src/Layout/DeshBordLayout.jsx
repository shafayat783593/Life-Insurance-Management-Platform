import React from 'react'
import { Link, NavLink, Outlet } from 'react-router'
// import Logo from '../pages/ShardeComponents/Logo/Logo'
import { FaHome, FaBox, FaFileAlt, FaHistory, FaUserShield, FaUsers, FaMoneyCheckAlt, FaUserTie, FaUserCheck, FaUserClock, FaMotorcycle, FaTruckLoading, FaCheckCircle, FaBlog, FaFileSignature, FaClipboardCheck, FaEnvelope } from "react-icons/fa";
import UseUserRole from '../Hooks/UserRole';
import logo from "../assets/logo.png"
import UseAuth from '../Hooks/UseAuth';
import { User } from 'lucide-react';
// import UseUserRole from '../Hooks/UseUserRole';
function DashBordLayout() {
    const { user } = UseAuth()
    console.log(user)

    const { role, roleLoading } = UseUserRole()
    // console.log(role)
    return (
        <div>

            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-center justify-center">

                    <div className="navbar  w-full">
                        <div className="flex-none lg:hidden">
                            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-6 w-6 stroke-current"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </label>
                        </div>


                    </div>



                    <Outlet />


                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-1">
                            <img className='w-15 rounded-full' src={logo} alt="" />  InsuranceCo
                        </Link>

                        <Link to="/profile" className="flex flex-col items-center justify-center my-6 gap-2">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400 shadow-md">
                                <img
                                    src={user?.photoURL}
                                    alt={user?.displayName || "User"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-center mt-2">
                                <h4 className="text-lg font-semibold text-gray-800">{user?.displayName}</h4>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                                {role && (
                                    <span className="mt-1 inline-block bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                                        {role}
                                    </span>
                                )}
                            </div>
                        </Link>



                        <li>
                            <Link
                                to="/"
                                className={({ isActive }) =>
                                    isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                }
                            >
                                <FaHome className="inline mr-2" />
                                Home
                            </Link>
                        </li>

                       


                        {/*  admin  */}

                        {
                            !roleLoading && role === "admin" && (


                                <>


                                    <li>
                                        <NavLink
                                            to="/dashboard/manage-applications"
                                            className={({ isActive }) =>
                                                isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                            }
                                        >
                                            <FaUserShield className="inline mr-2" />
                                            Manage Applications
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink
                                            to="/dashboard/manage-user"
                                            className={({ isActive }) =>
                                                isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                            }
                                        >
                                            <FaUsers className="inline mr-2" />
                                            Manage Users
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink
                                            to="/dashboard/manage-policies"
                                            className={({ isActive }) =>
                                                isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                            }
                                        >
                                            <FaFileAlt className="inline mr-2" />
                                            Manage Policie
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink
                                            to="/dashboard/manage-transaction"
                                            className={({ isActive }) =>
                                                isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                            }
                                        >
                                            <FaMoneyCheckAlt className="inline mr-2" />
                                            Manage Transactions
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/manage-blogs"
                                            className={({ isActive }) =>
                                                isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                            }
                                        >
                                            <FaBlog className="inline mr-2" />
                                            Manage Blogs
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/user-messages"
                                            className={({ isActive }) =>
                                                isActive ? "text-blue-400 font-bold bg-base-300 rounded" : ""
                                            }
                                        >
                                            <FaEnvelope className="inline mr-2" />
                                            User Messages
                                        </NavLink>
                                    </li>






                                </>


                            )
                        }


                        {/*  agent  */}

                        {
                            !roleLoading && role === "agent" && (<>



                                <li>
                                    <NavLink
                                        to="/dashboard/assigned-customers"
                                        className={({ isActive }) =>
                                            isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                        }
                                    >
                                        <FaUsers className="inline mr-2" />
                                        Assigned Customers
                                    </NavLink>
                                </li>


                                <li>
                                    <NavLink
                                        to="/dashboard/manage-blogs"
                                        className={({ isActive }) =>
                                            isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                        }
                                    >
                                        <FaBlog className="inline mr-2" />
                                        Manage Blogs
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/dashboard/policy-clearance"
                                        className={({ isActive }) =>
                                            isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                        }
                                    >
                                        <FaClipboardCheck className="inline mr-2" />
                                        Policy Clearance
                                    </NavLink>
                                </li>



                            </>

                            )
                        }


                        {/* customer */}
                        {
                            !roleLoading && role === "customer" && (
                                <>

                                    <li>
                                        <NavLink
                                            to="/dashboard/my-policies"
                                            className={({ isActive }) =>
                                                isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                            }
                                        >
                                            <FaFileAlt className="inline mr-2" />
                                            My Policies
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink
                                            to="/dashboard/payment-status"
                                            className={({ isActive }) =>
                                                isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                            }
                                        >
                                            <FaMoneyCheckAlt className="inline mr-2" />
                                            Payment Status
                                        </NavLink>
                                    </li>



                                    <li>
                                        <NavLink
                                            to="/dashboard/claim-request"
                                            className={({ isActive }) =>
                                                isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                            }
                                        >
                                            <FaFileSignature className="inline mr-2" />
                                            Claim Request
                                        </NavLink>
                                    </li>


                                </>




                            )
                        }




                        {/* <li>
                            <NavLink
                                to="/dashboard/manage-agents"
                                className={({ isActive }) =>
                                    isActive ? "text-blue-400  font-bold bg-base-300 rounded" : ""
                                }
                            >
                                <FaUserTie className="inline mr-2" />
                                Agents
                            </NavLink>
                        </li> */}





















                    </ul>


                </div>
            </div>

        </div >
    )
}

export default DashBordLayout
