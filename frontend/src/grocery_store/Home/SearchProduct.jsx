import axios from "axios";
import { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { mycontext } from "../Containers/Context";

function SearchProduct(){
    // let [search,setSearch] = useState("");
    // const [message,setMessage] = useState("");
    let [, , , , searchQuery, setSearchQuery] = useContext(mycontext);
    // let [products,setProducts] = useState([]);
    // const navigate = useNavigate();
    // const handleSearch = (value)=>{
    //     setSearch(value);
    //     if (value.trim() === "") {
    //         axios.get("http://127.0.0.1:8000/grocerystore/home/")
    //         .then((res)=>{
    //             setProducts(res.data);
    //         })
    //         .catch((err)=>{
    //             console.log("Error loading products:", err);
    //         });
    //         return;
    //     }

    //     axios.get(`http://127.0.0.1:8000/grocerystore/search/?search=${value}`)
    //     .then((res)=>{
    //         if(res.data.message){
    //             console.log(res.data.message)
    //             setProducts([])
    //             setMessage(res.data.message);
    //         }else{
    //             setProducts(res.data)
    //             setMessage("");
    //         }
    //     }).catch((err)=>{
    //         console.log("Search error:", err);
    //         setProducts([]);
    //     });
    // }
    return (
        <div style={{marginBottom:"20px"}}>
            <input type="text" placeholder="Search for Products..." value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)} />
            {/* {message && <p style={{color:"red"}}>{message}</p>} */}
            {/* <div style={{display:"flex",flexWrap:"wrap",gap:"20px"}}>
                {
                    products.map((p)=>(
                        <div key={p.product_id} style={{width:"200px"}}>
                            <img
                            src={`http://127.0.0.1:8000${p.image}`}
                            alt={p.product_name}
                            width="200"
                            style={{cursor:"pointer"}}
                            onClick={()=>navigate(`/viewproductdetails/${p.product_id}`)}
                        />
                        <p>{p.product_name}</p>
                        </div>
                    ))
                }
            </div> */}
        </div>
    )
}
export default SearchProduct;