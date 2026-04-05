import { BiCategory } from "react-icons/bi";
import { useRef,useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/PostProduct.css/"

function PostProducts(){
    // let pid = useRef();
    let navigate = useNavigate();
    let pname = useRef();
    let pdesc = useRef();
    let price = useRef();
    let imgs = useRef();
    let pquantity = useRef();
    let categoryRef = useRef();
    let uom = useRef();
    let [uoms,setUoms] = useState([]);
    let [categories, setCategories] = useState([]);
    useEffect(()=>{
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("is_admin");

        if(!token || isAdmin !== "true"){
            navigate("/");
        }
    },[]);

    useEffect(()=>{

        axios.get("http://127.0.0.1:8000/grocerystore/uom/")
        .then((res)=>{
            setUoms(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
        axios.get('http://127.0.0.1:8000/grocerystore/category/',{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem('token')
        }}).then((resp)=>{
            setCategories(resp.data);
        }).catch((err)=>{
            console.log(err);
        });
    },[])
    let postdata = ()=>{
        let post_url = 'http://127.0.0.1:8000/grocerystore/home/';
        let formData = new FormData();
        formData.append("product_name", pname.current.value);
        formData.append("price_per_item",price.current.value);
        formData.append("description", pdesc.current.value);
        formData.append("quantity", pquantity.current.value);
        formData.append("uom", uom.current.value);
        formData.append("category",categoryRef.current.value);
        formData.append("image", imgs.current.files[0]);
        axios.post(post_url,formData,{headers:{
            "Authorization":"Bearer "+localStorage.getItem('token')
        }}).then(
            (res)=>{
            console.log(res);
            if(res.status == 201){
                navigate('/');
            }
        }).catch(
            (err)=>{
                console.log(err)
            })
    }
    return (
        <div className="postproduct">
            <div>
                <label htmlFor="">Product Name<input type="text" ref={pname} /></label><br /><br />
                <label htmlFor="">Product Description<input type="text" ref={pdesc} /></label><br /><br />
                <label htmlFor="">Price Per Item<input type="text" ref={price} /></label><br /><br />
                <label htmlFor="">Product Quantity <input type="text" ref={pquantity} /></label><br /><br />
                <label htmlFor="">Unit Of Measurment
                    <select ref={uom}>{
                        uoms.map((obj)=>(
                            <option key={obj.uom_id} value={obj.uom_id}>{obj.uom_name}</option>
                        ))
                    }
                    </select>
                </label><br /><br />
                 <label>Category 
                    <select ref={categoryRef}
                    >
                        {categories.map(c => (
                            <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                        ))}
                    </select>
            </label><br /><br />
                <label htmlFor="">Product Image <input type="file" ref={imgs} /></label><br /><br />
            </div>
            <div className="button-group">
                <button onClick={postdata}>Insert</button>
                <button onClick={()=>navigate('/')}>Back</button>
            </div>
        </div>
    )

}
export default PostProducts;    