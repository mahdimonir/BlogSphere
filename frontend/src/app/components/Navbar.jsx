"use client";
import { useState ,useEffect} from "react";
import Link from "next/link";
import { Search, Bell, Moon,AlignJustify,X ,Sun} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [model ,setModel] =useState(false)
    const {user,token,login,logout} = useAuth();
    const [dark,setDark] = useState(false)
   
    const modelHandler =()=>{
    setModel(true)
    }
     const toggleTheme =()=>{
          if(dark==false) {
            document.body.classList.add("dark")
            setDark(true)
          }
          else{
            document.body.classList.remove("dark")
            setDark(false)
          }
       }
    
    return (
        <nav className="flex items-center sticky top-0 justify-between px-[25px] pt-5
        inset-0 bg-gradient-to-b from-black  to-transparent
        
        ">
            <Link href="/" className="text-lg font-bold text-blue-500">
                BlogSphere
            </Link>

            <div className="relative mx-4 flex-grow max-w-[20rem]">
                
                <input
                    type="text"
                    placeholder="search blog"
                    className="w-full rounded-full py-1 px-4 bg-gray-100 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>


            <div className=" flex justify-end items-center gap-5">
           
           <div className="w-[100px] relative  flex justify-center items-center border  dark:bg-white">
           <button className="p-1 absolute">
                    <Moon className="h-5 w-5 " color="white"  onClick={()=> toggleTheme()}/>
             </button>
             <button className="p-1 absolute">
                    <Sun className="h-5 w-5 " color="white"  onClick={()=> toggleTheme()}/>
             </button>

           </div>
         
           
           
            <div className="flex items-center gap-4  relative  justify-center">
             < AlignJustify className="md:hidden border  rounded-sm" color="white" onClick={modelHandler} />
             
              <div className= {`  flex items-center md:justify-center pt-3 md:pt-0
                  gap-3 bg-white md:bg-transparent shadow flex-col 
                  md:flex-row fixed md:relative top-0 h-full
                 ${model?"right-0 ":"left-full "} md:left-0 w-[10rem] md:w-auto `}>
                    
                <X className="right-0 md:hidden text-red-500" onClick={()=> setModel(false)} />
                {
                    user ? (<>
                    <div className="relative bg-red-300">
                      <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">7</span>
                    </div>
                     <Link href="/my-blogs" className="text-sm">
                         My blogs
                      </Link>
                    <Link href="/profile" className="text-sm">
                    Profile
                      </Link>
                      <Link href="/logout" onClick={()=> logout()} className="text-sm">
                    Logout
                      </Link>
                    </>):(
                        <>
                         <Link href="/login" className="text-sm  bg-blue-500 text-white text-center px-3  rounded-sm">
                       Sign in
                </Link>
                         <Link href="/signup" className="text-sm  ext-center px-3 text-black md:text-white  rounded-sm">
                       Sign up
                </Link>
                        </>
                       
                
                    )
                }
               
                
              </div>
                
            </div>
            </div>

        </nav>
    );
}
