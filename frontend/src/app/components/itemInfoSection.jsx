"use client"
import { useState,useEffect } from "react"
import { BeatLoader } from "react-spinners";

export default function UserDataFetch({tabs,itemInfo}){
  //tab[0] is default tab for all
  const [activeTab,setActiveTab] = useState(tabs[0].content);
  const [tabData,setTabData] = useState(null);
  const [loading,setLoading] = useState(false);
  const [err,setErr] = useState(null);

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
        </div>

      </div>
</>)


}