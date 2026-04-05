import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/grocerystore/admin/orders/",
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            setOrders(res.data);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch orders");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Admin - All Orders</h2> <button onClick={()=>navigate(-1)}>Back</button>

            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                orders.map((order) => (
                    <div
                        key={order.order_id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "20px",
                            borderRadius: "8px",
                        }}
                    >
                        {/* 🔹 Order Info */}
                        <h3>Order ID: {order.order_id}</h3>
                        <p><strong>Total:</strong> ₹{order.total}</p>

                        {/* 🔥 Status */}
                        <p
                            style={{
                                color:
                                    order.status === "cancelled"
                                        ? "red"
                                        : "green",
                                fontWeight: "bold",
                            }}
                        >
                            {order.status.toUpperCase()}
                        </p>

                        {/* 🔹 Items */}
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "10px",
                                }}
                            >
                                <img
                                    src={
                                        "http://127.0.0.1:8000" +
                                        item.product.image
                                    }
                                    alt=""
                                    width="120"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        navigate(
                                            "/viewproductdetails/" +
                                                item.product.product_id
                                        )
                                    }
                                />

                                <div>
                                    <p>{item.product.product_name}</p>
                                    <p>Qty: {item.quantity}</p>
                                    <p>₹{item.total_price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}

export default AdminOrders;