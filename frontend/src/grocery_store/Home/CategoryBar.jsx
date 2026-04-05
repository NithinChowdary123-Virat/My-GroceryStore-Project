import axios from "axios";
import { useEffect,useState,useContext } from "react";
import { mycontext } from "../Containers/Context";
import { useNavigate } from "react-router-dom";
function CategoryBar(){
    let [categorydata,setCategoryData] = useState([]);
    let navigate = useNavigate();
    let [, , selectedCategory, setSelectedCategory] = useContext(mycontext);
    const isAdmin = localStorage.getItem("is_admin") === "true";
    const token = localStorage.getItem("token");
    const showAdmin = token && isAdmin;
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/grocerystore/category/").then((resp)=>{
            console.log(resp);
            setCategoryData(resp.data);
        }).catch((err) => console.log(err));
    },[])
    return (
        <div className="category-bar">
            <button onClick={() => setSelectedCategory(null)}>All Categorys</button>
            {categorydata.map((obj)=>(
                <button  key={obj.category_id} onClick={() => setSelectedCategory(obj.category_id)}>{obj.category_name}</button>
            ))}
            {showAdmin && <button style={{ background: "#84c225", color: "white", cursor: "pointer" }}
                onClick={() => navigate("/insertproducts")}>
               ➕ Add Product     
            </button>}
        </div>
    )
}
export default CategoryBar;