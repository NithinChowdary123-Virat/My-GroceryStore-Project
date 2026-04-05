import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mycontext } from "./Context";
import SearchProduct from "../Home/SearchProduct";
import { FaUser, FaShoppingBasket } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/Head.css/";
import CategoryBar from "../Home/CategoryBar";


function Head(){
    let [isloggedin,setIsLoggedIn] = useContext(mycontext);
    const dropdownRef = useRef();
    let navigate = useNavigate()
    const [open,setOpen] = useState(false);
    let [products,setProducts] = useState([]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false); // 🔥 close dropdown
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    let viewcartitems = ()=>{
            const token = localStorage.getItem("token");
            if (token) {
                navigate("/viewcart");
            } else {
                toast.error("Please login first ❌",{
                        autoClose: 1000
                    });
            }
        }
        const handleLogout = () => {
            navigate("/logout");
        };
    return (<>
        <div className="navbar">
                <div className="logo">GroceryStore</div>
                <div className="search"><SearchProduct setProducts={setProducts} /></div>
                {!localStorage.getItem("token") && (
                    <button className="login" onClick={() => {
                        setIsLoggedIn(true);
                        setOpen(false);
                    }}>Login/Signup</button>
                )}
                {localStorage.getItem("token") && (
                    <div className="top-icons">


                        {/* Profile Icon */}
                        <div className="profile-section" ref={dropdownRef}>
                            <button className="profile-btn" onClick={()=>setOpen(!open)}><FaUser size={20}/></button>

                            {open && ( 
                                <div className="profile-dropdown" >
                                    <p onClick={()=> {
                                        navigate('/profile');
                                        setOpen(false);
                                    }}>My Account</p>
                                    <p onClick={()=>{
                                        navigate('/viewcart')
                                        setOpen(false);
                                    }}>My Basket 
                                        {/* <span className="badge red">0 item</span> */}
                                    </p>
                                    <p onClick={()=>{
                                        navigate('/orders');
                                        setOpen(false);
                                    }}>My Orders</p>
                                    {/* <p>My Smart Basket</p>
                                    <p>My Wallet <span className="badge green">₹0</span></p> */}
                                    {/* <p>Contact Us</p> */}
                                    <p className="logout" onClick={handleLogout}>Logout</p>

                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* Cart Icon */}
            <button className="cart-btn" onClick={viewcartitems}><FaShoppingBasket size={20}/></button>
        </div>
        <CategoryBar />
        </>
    )
}
export default Head;