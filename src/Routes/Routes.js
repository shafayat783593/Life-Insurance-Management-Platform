import {
    createBrowserRouter,

} from "react-router";
import HomeLayout from "../Layout/HomeLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../Layout/AuthLayout";
import Register from "../pages/Authancation/Register/Register";
import Login from "../pages/Authancation/Login/Login";

export const router = createBrowserRouter([

{
        path: "/",
     Component:HomeLayout,
        children: [
            {
                index:true,
                Component:Home



            }
        ]
},
{
    path:"/auth",
    Component:AuthLayout,
    children:[
        {
            path:"login",
            Component:Login

        },
        {
            path:"register",
            Component:Register
        }
    ]

}
])