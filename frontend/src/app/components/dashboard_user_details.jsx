
"use client"
import { useState,useEffect } from "react"
import { Search } from "lucide-react";
import { useRouter } from "next/navigation"

export default function dashBoardSearch({api,placeholder}){
  const [searchQuery,setSearchQuery]=useState("");

  const router = useRouter()
  const handleSearchChange =(e)=>{
   setSearchQuery(e.target.value)
  }
  const sendQuery =()=>{
    router.push(`${api}?search=${searchQuery}`)
  }
    return(<>
    <div className="p-5 flex items-center gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="px-2 text-sm py-1 border rounded outline-none"
        />
        <span><Search onClick={sendQuery} /></span>
      </div>
    </>)
    
}