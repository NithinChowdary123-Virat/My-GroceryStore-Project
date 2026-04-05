import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CancelOrder from "./CancelOrder";

function OrderDetails() {
    let navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/grocerystore/orders/${id}/`,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                }
            });
            setOrder(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    if (!order) return <p>Loading...</p>;

    return (
        <div>
            <h2>Order Details</h2>
            <button onClick={()=>navigate(-1)} style={{ 
                    background: "#ddbd1c", 
                    color: "white",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "20px",
                    marginLeft: "10px"
                 }}>Back</button>
            <p>Total: ₹{order.total}</p>

            {order.items.map((item, index) => (
                <div key={index}>
                    <div onClick={()=>navigate('/viewproductdetails/'+item.product.product_id)} style={{ cursor: "pointer" }}>
                        <img src={"http://127.0.0.1:8000"+ item.product.image} alt="" />
                    </div>
                    <p>{item.product.product_name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: ₹{item.total_price}</p>
                    <CancelOrder 
                        orderId={order.order_id} 
                        status={order.status} 
                        onCancelSuccess={fetchOrder}
                    />
                </div>
            ))}
        </div>
    );
}

export default OrderDetails;