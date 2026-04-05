import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CancelOrder from "./CancelOrder";
import { mycontext } from "../Containers/Context";
function Orders(){
    const [ordersdata,setOrdersData] = useState([]);
    const isAdmin = localStorage.getItem("is_admin") === "true";
    const token = localStorage.getItem("token");
    const showAdmin = token && isAdmin;
    const navigate = useNavigate();
    useEffect(()=>{
        fetchOrders();
    },[])
    const fetchOrders = async ()=>{
        try{
            const res = await axios.get('http://127.0.0.1:8000/grocerystore/orders/',{headers:{
                "Authorization":"Bearer "+localStorage.getItem('token')
            }})
            setOrdersData(res.data);
        } 
        catch (err){
            console.log(err);
        }
    }
    return (
        <div>
            <h2>My Orders</h2>
            {showAdmin && <button style={{ 
                    background: "#b69d1f", 
                    color: "white",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "20px",
                    position: "sticky",
                    top: "0",          
                    // z-index: "1000"
                 }}
                onClick={() => navigate("/admin/orders")}>
                    View All Orders     
                </button>
            }
            <button onClick={()=>navigate(-1)} style={{ 
                    background: "#ddbd1c", 
                    color: "white",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "20px",
                    marginLeft: "10px"
                 }}>Back</button> <br />
            {ordersdata.length === 0 ? (
                <p>No orders found</p>
                ) : (
                        ordersdata.map((order)=>(
                            <div key={order.order_id} style={{ 
                                border: "1px solid #ccc",
                                padding: "15px",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                }}
                            >
                                <h3>Order ID: {order.order_id}</h3>
                                <p><strong>Total:</strong> ₹{order.total}</p>
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
                                {order.items.map((item,index)=>(
                                    <div  key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px"}} >
                                        <img src={"http://127.0.0.1:8000" + item.product.image}  width="120" style={{ cursor: "pointer" }}
                                        onClick={()=>navigate('/viewproductdetails/'+item.product.product_id)} alt="" />

                                        <div>
                                            <p>{item.product.product_name}</p>
                                            <p>Qty: {item.quantity}</p>
                                            <p>₹{item.total_price}</p>
                                        </div>
                                    
                                        {/* <p>{item.product.product_name}</p> */}
                                        {/* <p>Order ID: {order.order_id}</p> */}
                                {/* <p>Total: ₹{order.total}</p> */}
                                </div>
                                ))}
                                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                <button
                                    onClick={() =>
                                        navigate(`/orders/${order.order_id}`)
                                    }
                                    style={{
                                        padding: "6px 10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    View Details
                                </button>

                                <CancelOrder
                                    orderId={order.order_id}
                                    status={order.status}
                                    onCancelSuccess={fetchOrders}
                                />
                            </div>
                                
                            </div>
                        ))
                    )
            }
        </div>
    )
}
export default Orders;