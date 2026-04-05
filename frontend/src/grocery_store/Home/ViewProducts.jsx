import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import ViewProductsDetails from "./ViewProductsDetails";
import { useContext } from "react";
import { mycontext } from "../Containers/Context";
import SearchProduct from "./SearchProduct";
import { FaUser, FaShoppingBasket } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/Product.css/";



function ViewProducts(){
    let [isloggedin,setIsLoggedIn,selectedCategory, , searchQuery] = useContext(mycontext);
    // const [selectedCategory, setSelectedCategory] = useState(null);
    let navigate = useNavigate()
    const [open,setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    let [products,setProducts] = useState([]);
    let openproduct = (id)=>{
        navigate('/viewproductdetails/'+id)
    }
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
    
    useEffect(()=>{
        let get_url;
        setLoading(true);
        get_url = 'http://127.0.0.1:8000/grocerystore/home/';
        if (searchQuery && searchQuery.trim() !== "") {
            get_url = `http://127.0.0.1:8000/grocerystore/search/?search=${searchQuery}`;
        } 
        else if (selectedCategory) {
            get_url = `http://127.0.0.1:8000/grocerystore/home/?category=${selectedCategory}`;
        }
        if (selectedCategory) {
            console.log("Selected Category:", selectedCategory);
        }
        axios.get(get_url).then(
            (res)=>{
                if (Array.isArray(res.data)) {
                setProducts(res.data);
            } else {
                setProducts([]); // 🔥 prevents crash
            }

        }).catch(
            (err)=>{
            console.log("Error fetching products:",err);
            setProducts([]);
        })
        .finally(()=>{
            setLoading(false); // 🔥 stop loading
        });
    },[searchQuery,selectedCategory])
    return (
        <div>
            <div  className="viewproduct">{
                loading ? (
                    <p style={{textAlign:"center", width:"100%"}}>Loading... ⏳</p>
                ) : products.length === 0 ? (
                <p style={{textAlign:"center", width:"100%"}}> No products found 😢</p>) : (
                products.map((obj)=>( <div key={obj.product_id}>
                    <button style={{border: "none"}} onClick={()=>openproduct(obj.product_id)}><img src={"http://127.0.0.1:8000" + obj.image }  width="150" alt={obj.product_name} /></button>
                    <h3>{obj.product_name}</h3>
                    <p>₹{obj.price_per_item}</p>
                    </div>
                    ))
                )}
            </div>
        </div>
    )
}
export default ViewProducts;