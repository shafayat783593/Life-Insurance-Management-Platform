import {
    createBrowserRouter,

} from "react-router";
import HomeLayout from "../Layout/HomeLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../Layout/AuthLayout";
import Register from "../pages/Authancation/Register/Register";
import Login from "../pages/Authancation/Login/Login";
import DashBordLayout from "../Layout/DeshBordLayout";
import ManagePolicies from "../pages/DeshBord/ManagePolicies";
import ManageApplications from "../pages/DeshBord/ManageApplications";
import ManageUsers from "../pages/DeshBord/ManageUser";
import MyPolicies from "../pages/DeshBord/UserDeshBord/MyPolicies";
import AllPolicies from "../pages/AllPolicies/AllPolicies";
import PolicyDetails from "../pages/PolicyDetails/PolicyDetails";
import PrivateRoutes from "../pages/Route/PrivateRoutes";
import QuotePage from "../pages/QuotePage/QuotePage";
import ApplicationForm from "../pages/ApplicationForm/ApplicationForm";
import AssignedCustomers from "../pages/DeshBord/AgentDeshBord/AssignedCustomers";
import ManageBlogs from "../pages/DeshBord/AgentDeshBord/ManageBlogs";
import ClaimRequest from "../pages/DeshBord/UserDeshBord/ClaimRequest";

export const router = createBrowserRouter([

    {
        path: "/",
        Component: HomeLayout,
        children: [
            {
                index: true,
                Component: Home



            }, {
                path: "policies",
                Component: AllPolicies
            }, {
                path: "policies/:id",
                Component: PolicyDetails
            }, {
                path: "quote",
                element: <PrivateRoutes>
                    <QuotePage />
                </PrivateRoutes>
            }, {
                path: "application",
                element: <PrivateRoutes>
                    <ApplicationForm />
                </PrivateRoutes>
            },
        ]
    }, {
        path: "/auth",
        Component: AuthLayout,
        children: [
            {
                path: "login",
                Component: Login

            },
            {
                path: "register",
                Component: Register
            }
        ]

    }, {
        path: "/dashboard",
        Component: DashBordLayout,
        children: [
            {
                path: "manage-policies",
                Component: ManagePolicies
            }, {
                path: "manage-applications",
                Component: ManageApplications
            }, {
                path: "manage-user",
                Component: ManageUsers
            }, {
                path: "my-policies",
                Component: MyPolicies

            },
            {
                path: "assigned-customers",
                element: <PrivateRoutes>
                    <AssignedCustomers />
                </PrivateRoutes>
            },{
                path:'manage-blogs',
                Component:ManageBlogs
            },{
                path:"claim-request",
                Component:ClaimRequest
            }
        ]
    }
])