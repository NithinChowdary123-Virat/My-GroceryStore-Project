import { useState } from "react";
import { useContext } from "react";
import { mycontext } from "../Containers/Context";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // The popup looks like a small notification at the top of the screen using toast
// import "react-toastify/dist/ReactToastify.css";
import '../../css/LoginStore.css'
import { IoClose } from "react-icons/io5";

function LoginStore(){
    let [isloggedin,setIsLoggedIn] = useContext(mycontext);
    const [isRegister, setIsRegister] = useState(false);
    let emailRef = useRef();
    let pwdRef = useRef();
    let navigate = useNavigate();
    let usernameRef = useRef();
    let confirmPwdRef = useRef();
    const clearInputs = () => {
        if (emailRef.current) emailRef.current.value = "";
        if (pwdRef.current) pwdRef.current.value = "";
        if (usernameRef.current) usernameRef.current.value = "";
        if (confirmPwdRef.current) confirmPwdRef.current.value = "";
    };
    let registerUser = ()=>{

      let password = pwdRef.current.value;
      let confirmPassword = confirmPwdRef.current.value;

      if(password !== confirmPassword){
          toast.error("Passwords do not match",{
            autoClose: 1000   // popup stays for 1 second
        });

          return;
      }
      let userdata = {
        username:usernameRef.current.value,
        email:emailRef.current.value,
        password:password
      }
      let register_url = "http://127.0.0.1:8000/grocerystore/register/";
      axios.post(register_url,userdata).then((resp)=>{
        console.log(resp);
        localStorage.setItem("admin_token",resp.data.access);
        localStorage.setItem("is_admin",resp.data.is_admin);    

        toast.success("Registration successful",{
            autoClose: 1000   // popup stays for 1 second
        });

        setIsRegister(false);
      }).catch((err)=>{
          console.log(err.response.data);
          toast.error("Something is Unclear",{
            autoClose: 1000   // popup stays for 1 second
        });

      });
    }
    let onClose=()=>{
      clearInputs();
      setIsLoggedIn(false);
    };
    let getlogin = ()=>{
      let credentials = {
        "email" : emailRef.current.value,
        "password" : pwdRef.current.value
      }
      let login_url = 'http://127.0.0.1:8000/grocerystore/login/';
      axios.post(login_url,credentials).then((resp)=>{
        console.log(resp);
        // 🔥 Store tokens
        localStorage.setItem('token',resp.data.access);
        localStorage.setItem('is_admin',resp.data.is_admin);
        localStorage.setItem("refresh",resp.data.refresh);
        // 🔥 IMPORTANT: Store user info
        localStorage.setItem("user", JSON.stringify({
            username: resp.data.username,
            email: resp.data.email
        }));
        // setIsLoggedIn(true);
        toast.success("Login Successful 🎉",{
            autoClose: 1000   // popup stays for 1 second
        });
        console.log(resp.data);
        clearInputs();
        navigate('/');
        setIsLoggedIn(false);

      }).catch((err)=>{
        console.log(err.response.data);
        toast.error("Invalid login credentials",{
            autoClose: 1000   // popup stays for 1 second
        });
      })
    }

  
    return (<>
      <div className="overlay">
        <button className="close-btn" onClick={onClose}>
            <IoClose size={30}/>
        </button>
        <div className="container">
          
          {/* Left Side */}
          <div className="left-side">
            <h3>Why choose our store?</h3>

            <div className="features">
              <p>✔ Quality products</p>
              <p>✔ On time delivery</p>
              <p>✔ Easy returns</p>
              <p>✔ Free delivery</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="right-side">

            {isRegister ? (<div key="register"><h2>Create Account</h2>

              <p><span onClick={()=>{
                clearInputs();
                setIsRegister(false);
              }} style={{cursor:"pointer"}} ><b>Login to your account</b></span></p>

              <input type="text" ref={usernameRef} placeholder="Enter Username" />
              <input type="text" ref={emailRef} placeholder="Enter Email" />
              <input type="password" ref={pwdRef} placeholder="Enter Password" />
              <input type="password" ref={confirmPwdRef} placeholder="Confirm Password" />
              <button onClick={registerUser} className="continue-btn">Register</button>

            </div>) : 
            ( <div key="Login"> <h2>Login</h2>

              <p>or<span onClick={()=>{
                setIsRegister(true);
                clearInputs();
              }} style={{cursor:"pointer"}}><b>create an account</b></span></p>

              <input type="text" ref={emailRef} placeholder="Enter Email" />
              <input type="password" ref={pwdRef} placeholder="Enter Password" />
              <button onClick={getlogin} className="continue-btn">Continue</button>

              </div>

            )}

            </div>

        </div>
      </div>

      </>
    );
}

export default LoginStore;