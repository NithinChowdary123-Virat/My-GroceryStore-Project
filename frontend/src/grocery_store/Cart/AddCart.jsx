import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

function AddCart({productId}){
    const [added, setAdded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkCart = async () => {
            try {
                let token = localStorage.getItem("token");
                if (!token) return;

                let res = await axios.get(
                    "http://127.0.0.1:8000/grocerystore/viewcart/",
                    {
                        headers: { Authorization: "Bearer " + token }
                    }
                );

                // 👉 check if product exists in cart
                let exists = res.data.some(
                    (item) => item.product.product_id === productId
                );

                if (exists) {
                    setAdded(true);
                }
            } catch (err) {
                console.log("Cart check error", err);
            }
        };
        checkCart();
    }, [productId]);

    let AddToCart = async ()=>{
        try {
            let token = localStorage.getItem("token"); // ✅ matches LoginStore.jsx
            console.log("Token from storage:", token);  
            console.log("Auth header:", "Bearer " + token);
            if (!token) {
                toast.error("Please login first ❌",{
                    autoClose: 1000
                });
                return;
            }
            let response = await axios.post(
                `http://127.0.0.1:8000/grocerystore/add-to-cart/${productId}/`,
                {},
                { headers: { "Authorization": "Bearer " + token } }
            );
            toast.success("Product added to cart ✅",{
                autoClose: 1000
            });
            setAdded(true); 
        }
        catch(error){
            console.error(error);
            if (error.response?.status === 401) {
                toast.error("Please login first ❌",{
                    autoClose: 1000  
                });
            } else {
                toast.error("Something went wrong ❌",{
                    autoClose: 1000   // popup stays for 1 second
                });
            }
        }
    };

    return (
        <div>
            {added ? (
                <button onClick={() => navigate("/viewcart")}>🛒 View Cart</button>
            ) : (
                <button onClick={AddToCart}>🛒 Add To Cart</button>
            )}

        </div>
    ); 
}

export default AddCart;