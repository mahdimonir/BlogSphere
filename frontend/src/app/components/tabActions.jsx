"use client"
import { useState,useEffect } from "react"
import { BeatLoader } from "react-spinners";
import { useAuth } from "@/context/AuthContext";

export default function tabActions({tabs,itemInfo}){
  //tab[0] is default tab for all
  const [activeTab,setActiveTab] = useState(tabs[0].content);
  const [tabData,setTabData] = useState(null);
  const [loading,setLoading] = useState(false);
  const [err,setErr] = useState(null);
  const {user,token} =useAuth();
  
    useEffect(()=>{
     setErr(null)
      //fecth data from collections by userid  or username
     const currentTabAPI = tabs.find((item)=> item.content==activeTab)
    if (!currentTabAPI?.api) return;

    const fetchData = async ()=>{
      try{
        setLoading(true)
      const res =await fetch(currentTabAPI.api);
      if(!res.ok) throw new Error("Failed to fetch data")
      const data = await res.json();
       setTabData(data)
    }catch(err){
     setLoading(false)
     setErr(err)
       }
       finally{
        setLoading(false)
       }
      }
      fetchData();
  
    },[activeTab,tabs])

const content =()=>{
     switch (activeTab) {
      case "All posts" :
      return <AllPosts data={tabData} />
    
      case "Pending posts":
       return <PendingPosts data={tabData} />
      
      case "Suspended":
      return <Suspended data={tabData} />
      
      case "Actions":
      return <Action data ={ tabData} />
    
     }
}


return(<>
   <div className="flex flex-col  flex-1  bg-white p-3 rounded-md">
        <div className="flex gap-3 text-gray-700">
          {
            tabs.map((item,i)=> <div key={i} onClick={()=> setActiveTab(item.content)    } className="cursor-pointer hover:bg-gray-300 px-3 py-1 text-sm">{item.content} </div>
          )
          }
            
        </div>
        <div className="w-full flex-1 h-full mx-3  flex justify-center items-center  ">
           {
            loading &&<div className="w-full h-full flex justify-center items-center text-red-500 font-bold "> <BeatLoader  color="gray" size="10px"/>  </div>
           }
           {
            err && <div className="w-full h-full flex justify-center items-center text-red-500 font-bold ">Something went wrong ! Need to set up proper api </div>
           }
           {
            !loading && !err && !tabData ? <div className="p-3"> {content}</div> :
            <div className="w-full h-full flex justify-center items-center text-sm font-bold">Empty</div>
           }
        </div>

      </div>
</>)

}


const AllPosts =({data})=>{
  return(<>
    <div>
    List of all posts
    </div>
    
    </>)

}

const PendingPosts =({data})=>{
  return(<>
    <div>
    List of all pending posts
    </div>
    
    </>)

}

const Suspended =({data})=>{
  return(<>
    <div>
    List of all suspended posts
    </div>
    
    </>)

}
const Action =({data})=>{
  return(<>
    <div className="w-full h-full flex flex-col justify-center items-center ">
   <div className="border p-3 ">
   <span className="text-sm font-bold">Suspend user account</span> 
     <input type="text" className="border-gray-500 p-" placeholder="Describe the reason" />
    
    </div>
    </div>
    
    </>)

}
