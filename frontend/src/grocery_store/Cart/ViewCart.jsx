import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingBasket } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/ViewCart.css/"

function ViewCart() {
    const [cartitems, setCartItems] = useState([]);
    const navigate = useNavigate();

    // ✅ Fetch cart (single function)
    const fetchCart = () => {
        axios.get('http://127.0.0.1:8000/grocerystore/viewcart/', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        })
        .then((resp) => {
            setCartItems(resp.data);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // ✅ Update quantity (+ / -)
    const updateQuantity = (id, action) => {
        axios.patch(
            'http://127.0.0.1:8000/grocerystore/updatecart/' + id + '/',
            { action: action },
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                }
            }
        )
        .then((res) => {
            if (res.data?.message) {
                toast.success(res.data.message,{
                    autoClose: 1000  
                }); // optional
            }
            fetchCart(); // 🔥 refresh UI
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const removeItem = (id) => {
        axios.delete(
            `http://127.0.0.1:8000/grocerystore/updatecart/${id}/`,
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
        )
        .then((res) => {
            if (res.data?.message) {
                toast.success(res.data.message,{
                    autoClose: 1000  
                });
            }
            fetchCart(); // 🔥 refresh
        })
        .catch((err) => {
            console.log(err);
        });
    };
    const placeOrder = async ()=>{
        try{
            let res = await axios.post('http://127.0.0.1:8000/grocerystore/orders/create/',{},{headers:{
                "Authorization":"Bearer "+localStorage.getItem('token')
            }});
             if (res.data?.message) {
            toast.success(res.data.message, {
                autoClose: 1000
            });
            }
            fetchCart(); // 🔥 refresh cart after order
            navigate("/orders"); // optional redirect
        } catch(err){
            console.log(err);
            toast.error("Order failed!",{
                autoClose: 1000
            });
        }
    };

    // ✅ Empty cart UI
    if (cartitems.length === 0) {
        return (
            <div style={{
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <FaShoppingBasket size={80} color="#94a3b8" />
                <h2>Your basket is empty!</h2>

                <button
                    onClick={() => navigate("/")}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#3b5bdb",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Shop now
                </button>
            </div>
        );
    }

    // ✅ Cart items UI
    return (
        <div className="viewcart">
            {cartitems.map((item) => (
                <div  className="cart-card" key={item.cart_item_id} >
                    <div className="cart-image">
                        <img
                            src={"http://127.0.0.1:8000" + item.product.image}
                            width="150"
                            alt={item.product.product_name}
                        />
                    </div>
                    <div className="cart-details">
                        <h3>{item.product.product_name}</h3>
                        <p>{item.product.description}</p>
                        <p>₹{item.product.price_per_item}</p>

                        {/* 🔥 Quantity buttons */}
                        <div className="qty-box">
                            <button onClick={() => updateQuantity(item.cart_item_id, "decrease")}>-</button>
                            <span>{item.quantity}</span>
                            {/* <div style={{
                                flex: 1,
                                background: "white",
                                textAlign: "center"
                            }}>
                                {item.quantity}
                            </div> */}
                            <button onClick={() => updateQuantity(item.cart_item_id, "increase")}>+</button>

                        {/* <button
                            style={{ flex: 1, color: "white" }}
                            onClick={() => updateQuantity(item.cart_item_id, "increase")}
                        >
                            +
                        </button> */}
                    </div>

                    <p className="total">Total: ₹{item.quantity * item.product.price_per_item}</p>
                    <div className="cart-actions">
                        <button className="remove-btn" onClick={() => removeItem(item.cart_item_id)}><FaTrash /> Remove </button>
                    </div>
                    </div>
                </div>
            ))}
            <div className="cart-footer">
                <button className="back-btn"  onClick={()=>navigate(-1)}>Back</button>
                <button className="order-btn" onClick={placeOrder}>Place Order</button>
            </div>
        </div>
    );
}

export default ViewCart;