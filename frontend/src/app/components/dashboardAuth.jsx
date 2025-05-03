"use client"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"


export default function DashboardRouteAuth({children}){
    const {user} = useAuth();
    const router= useRouter();
    useEffect(()=>{
         if (!user) {
            router.push("/login");
             } else {
              if (user.role === "admin") {
                  router.push("dashboard/users")
              }
            } 
    })
    return(
    <div>
     {
        children
     }
    </div>
       
    )
    
}