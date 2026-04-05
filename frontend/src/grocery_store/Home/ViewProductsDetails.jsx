import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import AddCart from "../Cart/AddCart";
import { useNavigate } from "react-router-dom";
import "../../css/ViewProductDetails.css/";
function ViewProductsDetails(){
    let navigate = useNavigate();
    let base = "http://127.0.0.1:8000"
    let {id} = useParams();
    let [product,setProduct] = useState(null);
    const isAdmin = localStorage.getItem("is_admin") === "true";
    const token = localStorage.getItem("token");
    const showAdmin = token && isAdmin;
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/grocerystore/modifyproduct/"+id)
        .then((res)=>{
            setProduct(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[id])
    if(!product){
        return <p>Loading...</p>
    }
    return (
        <div className="viewcard">
            <div className="image-section">
                {product.image ? <img src={base+product.image} width="150" alt="" /> : "" }
            </div>
            <div className="details-section">
                <h1>{product.product_name}</h1>
                <p>{product.description}</p>
                <p>{product.uom.uom_name}</p>
                <p>₹{product.price_per_item}</p>
                <AddCart productId={product.product_id} /> 
                <button className="back-btn" onClick={()=>navigate('/')}>Back</button>
                {/* <p>Quantity: {product.quantity}</p> */}
                {showAdmin && 
                    <div className="admin-actions" style={{ marginTop: "15px" }}>
                        <button  onClick={() => navigate(`/updateproducts/${product.product_id}`)}>Update</button>
                        <button  onClick={() => navigate(`/deleteproduct/${product.product_id}`)}>Delete</button>
                    </div>
                }
            </div>
        </div>
    )
}
export default ViewProductsDetails