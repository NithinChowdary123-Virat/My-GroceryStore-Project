import { createContext, useContext, useState } from "react";
import {Route, Routes} from "react-router-dom"
import ViewProducts from "../Home/ViewProducts";
import ViewProductsDetails from "../Home/ViewProductsDetails";
import PostProducts from "../Admin/PostProducts";
import UpdateProducts from "../Admin/UpdateProducts";
import DeleteProducts from "../Admin/DeleteProducts";
import LoginStore from "../Home/LoginStore";
import LogoutStore from "../Home/LogoutStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewCart from "../Cart/ViewCart";
import Orders from "../Cart/Orders";
import OrderDetails from "../Cart/OrderDetails";
import AdminOrders from "../Cart/AdminOrders";
import Profile from "../Home/Profile";
import '../../css/main.css/'

import { mycontext } from "./Context";
// export const mycontext = createContext();

function Main(){
    let [isloggedin,setIsLoggedIn] = useContext(mycontext);
    return (
        <><ToastContainer position="top-center" />
        <main>
            <Routes>
                <Route path="/" element={<ViewProducts />}></Route>
                <Route path="/viewproductdetails/:id" element={<ViewProductsDetails />}></Route>
                <Route path="/insertproducts" element={<PostProducts />} ></Route>
                <Route path="/updateproducts/:id" element={<UpdateProducts />} ></Route>
                <Route path="/deleteproduct/:pk" element={<DeleteProducts />}></Route>
                <Route path="/viewcart" element={<ViewCart />}></Route>
                <Route path="/orders" element={<Orders />}></Route>
                <Route path="/orders/:id" element={<OrderDetails />}></Route>
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/profile" element={<Profile />} />
                {/* <Route path="/loginstore" element={<LoginStore />}></Route> */}
                <Route path="/logout" element={<LogoutStore />}></Route>

            </Routes>
            {isloggedin && <LoginStore />}
        </main>
        </>
    )
}
export default Main;