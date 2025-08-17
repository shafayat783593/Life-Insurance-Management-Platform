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
import PaymentStatus from "../pages/DeshBord/UserDeshBord/PaymentStatus";
import Payment from "../pages/DeshBord/UserDeshBord/Payment/StripeProvider";
import StripeProvider from "../pages/DeshBord/UserDeshBord/Payment/StripeProvider";
import PolicyClearance from "../pages/DeshBord/AgentDeshBord/PolicyClearance";
import BlogsDetails from "../pages/Home/Blogs/BlogsDetails";
import Allblogs from "../pages/Home/Blogs/Allblogs";
import UserProfile from "../pages/UserProfile/UserProfile";
import AllAgents from "../pages/AllAgents";
import FAQ from "../pages/Faq";
import Forbidden from "../pages/Forbidden";
import AgentPrivateRouters from "../pages/Route/AgentPrivateRouters";
import AdminPrivateRoutes from "../pages/Route/AdminPrivateRouters";
import CostomerPrivateRouter from "../pages/Route/CostomerPrivateRouter";
import ManageTransactions from "../pages/DeshBord/ManageTransaction";
import DeshBordHome from "../pages/DeshBord/DeshBordHome/DeshBordHome";
import ForgotPassword from "../pages/ForgetPassword";
import TermsAndConditions from "../pages/TermsAndConditions/TermsAndConditions";
import HelpCenter from "../pages/HelpCenter/HelpCenter";
import Layout from "../Layout/Layout";
import ContactSupport from "../pages/Contact Support/ContactSupport";
import UserMessages from "../pages/DeshBord/UserDeshBord/Messages";
import NotFound from "../pages/NotFoundPage/NotFound";

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
                path: "blogs/:id",
                element: <PrivateRoutes>
                    <BlogsDetails />
                </PrivateRoutes>
            }, {
                path: "All-blogs",
                element: <PrivateRoutes>
                    <Allblogs />
                </PrivateRoutes>
            },
            {
                path: "application",
                element: <PrivateRoutes>
                    <ApplicationForm />
                </PrivateRoutes>
            }, {
                path: "profile",
                element: <PrivateRoutes>
                    <UserProfile />
                </PrivateRoutes>
            }, {
                path: "all-agents",
                Component: AllAgents
            }, {
                path: "faq",
                Component: FAQ
            }, {
                path: "forbidden",
                Component: Forbidden
            }, {
                path: "condition",
                Component: TermsAndConditions
            }, {
                path: "helpCenter",
                Component: HelpCenter
            }, {
                path: "contactSupport",
                Component: ContactSupport
            },{
                path:"notfound",
                Component:NotFound
            }
        ]
    },

    //     path: "/",
    //     Component: Layout,
    //     children: [
    //         {
    //             path: "helpCenter",
    //             Component: ContactSupport
    //         }
    //     ]
    // },



    {
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
            }, {
                path: "forget",
                Component: ForgotPassword
            }
        ]

    }, {
        path: "/dashboard",
        Component: DashBordLayout,
        children: [
            {
                index: true,
                Component: DeshBordHome
            },
            {
                path: "manage-policies",
                element: <AdminPrivateRoutes>
                    <ManagePolicies />
                </AdminPrivateRoutes>
            }, {
                path: "manage-applications",
                element: <AdminPrivateRoutes>
                    <ManageApplications />
                </AdminPrivateRoutes>
            }, {
                path: "manage-user",
                element: <AdminPrivateRoutes>
                    <ManageUsers />
                </AdminPrivateRoutes>
            },{
                path:"user-messages",
                element:<AdminPrivateRoutes>
                  <UserMessages/>
                </AdminPrivateRoutes>


            }, {
                path: "my-policies",
                element: <CostomerPrivateRouter>
                    <MyPolicies />
                </CostomerPrivateRouter>

            },
            {
                path: "assigned-customers",
                element: <AgentPrivateRouters>
                    <AssignedCustomers />
                </AgentPrivateRouters>
            }, {
                path: 'manage-blogs',
                Component: ManageBlogs
            }, {
                path: "claim-request",
                element: <CostomerPrivateRouter>
                    <ClaimRequest />
                </CostomerPrivateRouter>
            }, {
                path: "payment-status",
                element: <CostomerPrivateRouter>
                    <PaymentStatus />
                </CostomerPrivateRouter>

            }, {
                path: "payment/:id",
                element: <CostomerPrivateRouter>
                    <StripeProvider />
                </CostomerPrivateRouter>

            }, {
                path: "policy-clearance",
                element: <PolicyClearance>
                    <PolicyClearance />
                </PolicyClearance>
            }, {
                path: "manage-transaction",
                element: <AdminPrivateRoutes>
                    <ManageTransactions />
                </AdminPrivateRoutes>
            }
        ]
    }
])