// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Head from './grocery_store/Containers/Head'
import { useState } from "react";
import Main from './grocery_store/Containers/Main';
import { mycontext } from "./grocery_store/Containers/Context";
import { BrowserRouter } from 'react-router-dom';


function App(){
  const [isloggedin, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className='app'>
        <BrowserRouter>
        <mycontext.Provider value={[
          isloggedin,
          setIsLoggedIn, 
          selectedCategory,
          setSelectedCategory,
          searchQuery,
          setSearchQuery]}>
        <Head />
        <Main className='main'/>
        </mycontext.Provider>
        </BrowserRouter>
    </div>
  )
}
  

export default App
