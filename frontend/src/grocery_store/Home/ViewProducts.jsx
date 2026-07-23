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
import "../../css/Product.css";
import { getImageUrl } from "../utils/getImageUrl";


function ViewProducts(){
    let [isloggedin,setIsLoggedIn,selectedCategory, , searchQuery] = useContext(mycontext);
    // const [selectedCategory, setSelectedCategory] = useState(null);
    let navigate = useNavigate()
    const [open,setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [slowLoading, setSlowLoading] = useState(false);
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
        setSlowLoading(false);

        let slowTimer = setTimeout(() => {
            setSlowLoading(true);
        }, 2000);

        get_url = 'https://grocerystore-backend-clif.onrender.com/grocerystore/home/';
        if (searchQuery && searchQuery.trim() !== "") {
            get_url = `https://grocerystore-backend-clif.onrender.com/grocerystore/search/?search=${searchQuery}`;
        } 
        else if (selectedCategory) {
            get_url = `https://grocerystore-backend-clif.onrender.com/grocerystore/home/?category=${selectedCategory}`;
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
            clearTimeout(slowTimer);   
            setSlowLoading(false);
        });
    },[searchQuery,selectedCategory])
    return (
        <div>
            <div  className="viewproduct">{
                loading ? (
                    <div style={{textAlign:"center", width:"100%", padding: "40px 20px", gridColumn: "1 / -1"}}>
                        <p>Loading... <div className="spinner"></div></p>
                        {slowLoading && (
                            <p style={{color: "#84c225", fontWeight: "bold", marginTop: "10px"}}>
                                Please wait up to 2 minutes — our server is waking up 🌙
                            </p>
                        )}
                    </div>
                ) : products.length === 0 ? (
                <p style={{textAlign:"center", width:"100%"}}> No products found 😢</p>) : (
                products.map((obj)=>( <div key={obj.product_id}>
                    <button style={{border: "none"}} onClick={()=>openproduct(obj.product_id)}>{getImageUrl(obj.image) && <img src={getImageUrl(obj.image)} width="150" alt={obj.product_name} />}</button>
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