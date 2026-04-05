import { useEffect, useRef, useState} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/UpdateProduct.css/"

function UpdateProducts(){
    let navigate = useNavigate();
    let [categories, setCategories] = useState([]);
    let {id} = useParams();
    let [product,setProduct] = useState({});
    let [uom,setUom] = useState([]);
    let [image,setImage] = useState(null);
    // let pname = useRef();
    // let desc = useRef();
    // let priceRef = useRef();
    // let quantRef = useRef();
    // let uomRef = useRef();
    // let imgs = useRef();
    useEffect(()=>{
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("is_admin");

        if(!token || isAdmin !== "true"){
            navigate("/");
        }
    },[]);

    useEffect(()=>{
        let updateurl = 'http://127.0.0.1:8000/grocerystore/modifyproduct/'+id;
        axios.get(updateurl,{headers:{
            "Authorization":"Bearer "+localStorage.getItem('token')
        }}).then(
            (res)=>{
                setProduct(res.data);
            }
        ).catch((err)=>{
                console.log(err);
            });
        axios.get("http://127.0.0.1:8000/grocerystore/uom/",{headers:{
            "Authorization":"Bearer "+localStorage.getItem('token')
        }}).then(
            (res)=>{
                setUom(res.data);
        });
        axios.get('http://127.0.0.1:8000/grocerystore/category/',{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem('token')
        }}).then((resp)=>{
            setCategories(resp.data);
        }).catch((err)=>{
            console.log(err);
        });
    },[id]);
    let handleChange = (e)=>{
        setProduct({
            ...product,
            [e.target.name]:e.target.value
        });
    }
    let updatedata = ()=>{
        let inputdata = new FormData();
        inputdata.append("product_name",product.product_name);
        inputdata.append("description",product.description);
        inputdata.append("price_per_item",product.price_per_item);
        inputdata.append("quantity",product.quantity);
        inputdata.append("uom",product.uom?.uom_id || product.uom);
        inputdata.append("category",product.category?.category_id || product.category);
        if(image){
            inputdata.append("image",image);
        }
        let update_url = 'http://127.0.0.1:8000/grocerystore/modifyproduct/'+id;

        axios.patch(update_url,inputdata,{headers:{
            "Authorization":"Bearer "+localStorage.getItem('token')
        }}).then((resp)=>{
            navigate('/');
        }).catch((err)=>{
            console.log(err);
        })
    }

    return (
        <div className="update-container">
            <h2>Update Product</h2>
            <div className="button-group">
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            </div>
            <label htmlFor="">Product Name 
                <input type="text" name="product_name" value={product.product_name || ""} onChange={handleChange} /></label><br /><br />
            <label htmlFor="">Description 
                <input type="text" name="description" value={product.description || ""} onChange={handleChange}/></label><br /><br />
            <label htmlFor="">Price Per Item 
                <input type="text" name="price_per_item" value={product.price_per_item || ""} onChange={handleChange} /></label><br /><br />
            <label htmlFor="">Quantity 
                <input type="text" name="quantity" value={product.quantity || ""}  onChange={handleChange} /></label><br /><br />
            <label htmlFor="">Unit Of Measurment
                <select  name="uom" value={product.uom || ""} onChange={handleChange}>
                    {
                        uom.map((item)=>(
                            <option key={item.uom_id} value={item.uom_id}>{item.uom_name}</option>
                        ))
                    }
                </select>
            </label><br /><br />
            <label>Category 
                    <select name="category" 
                        value={product.category?.category_id || product.category || ""} 
                        onChange={handleChange}
                    >
                        {categories.map(c => (
                            <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                        ))}
                    </select>
            </label><br /><br />
            {product.image && (
                <div>
                    <p>Current Image:</p>
                    <img src={'http://127.0.0.1:8000'+product.image} width="150" />
                </div>
            )} <br />
            <label>
                Change Image
                <input 
                type="file"
                onChange={(e)=>setImage(e.target.files[0])}
                />
            </label>

            <br/><br/>
            <div className="button-group">
                <button onClick={updatedata} >Update</button>
            </div>
        </div>
    )
}
export default UpdateProducts;