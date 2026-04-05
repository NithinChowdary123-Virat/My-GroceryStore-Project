import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { mycontext } from "../Containers/Context";
import { useEffect, useContext,useRef } from "react";

function LogoutStore(){
    const navigate = useNavigate();
    const [isloggedin,setIsLoggedIn] = useContext(mycontext);
    const executed = useRef(false);
    useEffect(()=>{
        if(executed.current) return;
        executed.current = true;
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");

        toast.success("Logged out successfully",{
            autoClose: 1000   // popup stays for 1 second
        });

        setIsLoggedIn(false);

        setTimeout(()=>{
            navigate("/");
        },100);

    },[]);
    return null;

}

export default LogoutStore;