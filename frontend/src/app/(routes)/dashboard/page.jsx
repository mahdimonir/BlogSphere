"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
// import { useAuth } from "@/context/AuthContext";
// import { LayoutGridIcon } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// import UserManagement from "@/app/(routes)/dashboard/users/page";
// import CommentManagement from "@/app/components/dashboard_comments";
// import PostManagement from "@/app/components/dashboard_posts";
// import {BeatLoader} from "react-spinners"


// const tabs=[
//   {key:"users",label:"Users",endpoint:"/users"},
//   {key:"posts",label:"Posts",endpoint:"/posts"},
//   {key:"comments",label:"Comments",endpoint:"/comments"}
// ]

// export default function Dashboard() {
//   const [activeTab,setActiveTab]= useState("users");
//   const [loading,setLoading] =useState(false)
//   const [error, setError] = useState("");
//   const [tabData,setTabData]=useState(null)

//   const [posts, setPosts] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [allPosts, setAllPosts] = useState([]);
//   const [comments, setComments] = useState([]);
//   const { user, token, logout } = useAuth();
//   const router = useRouter();

//   // const dataFetch = async (endpoint)=>{
//   //   try{
//   //     setLoading(true)
//   //     const res = await fetch(
//   //       `https://jsonplaceholder.typicode.com${endpoint}`,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );
//   //     if (!res.ok) throw new Error("Failed to fetch data");
    
//   //     const data = await res.json();
//   //     setTabData(data);
//   //   }catch(err){
//   //     setError(err.message)
//   //   }
//   //   finally{
//   //     setLoading(false)
//   //   }
//   //   }
    
//   // useEffect(() => {
//   //    const Tab = tabs.find((tab)=> tab.key == activeTab)
//   //      dataFetch(Tab.endpoint)
//   //   // if (!user) {
//   //   //   router.push("/login");
//   //   // } else {
//   //   //   fetchUserPosts();
//   //   //   if (user.role === "admin") {
      
//   //   //   }
//   //   // }
//   // }, [activeTab]);

//   const fetchUserPosts = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/posts/my`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (!res.ok) throw new Error("Failed to fetch posts");
//       const data = await res.json();
//       setPosts(data);
//     } catch (err) {
//       setError("Error fetching your posts");
//     }
//   };

//   // const fetchAllUsers = async () => {
//   //   try {
//   //     const res = await fetch(
//   //       `${process.env.NEXT_PUBLIC_API_URL}/api/users/all`,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );
//   //     if (!res.ok) throw new Error("Failed to fetch users");
//   //     const data = await res.json();
//   //     setUsers(data);
//   //   } catch (err) {
//   //     setError("Error fetching users");
//   //   }
//   // };


//   // const fetchAllPosts = async () => {
//   //   try {
//   //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
//   //     if (!res.ok) throw new Error("Failed to fetch posts");
//   //     const data = await res.json();
//   //     setAllPosts(data);
//   //   } catch (err) {
//   //     setError("Error fetching all posts");
//   //   }
//   // };

//   // const fetchAllComments = async () => {
//   //   try {
//   //     const res = await fetch(
//   //       `${process.env.NEXT_PUBLIC_API_URL}/api/comments/all`,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );
//   //     if (!res.ok) throw new Error("Failed to fetch comments");
//   //     const data = await res.json();
//   //     setComments(data);
//   //   } catch (err) {
//   //     setError("Error fetching comments");
//   //   }
//   // };

//   const handleDeletePost = async (postId) => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (res.ok) {
//         setPosts(posts.filter((post) => post._id !== postId));
//         setAllPosts(allPosts.filter((post) => post._id !== postId));
//       } else {
//         const data = await res.json();
//         setError(data.message);
//       }
//     } catch (err) {
//       setError("Error deleting post");
//     }
//   };

//   const handleSuspendUser = async (userId) => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/users/suspend/${userId}`,
//         {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (res.ok) {
//         setUsers(
//           users.map((u) => (u._id === userId ? { ...u, isSuspended: true } : u))
//         );
//       } else {
//         const data = await res.json();
//         setError(data.message);
//       }
//     } catch (err) {
//       setError("Error suspending user");
//     }
//   };

//   const handleUnsuspendUser = async (userId) => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/users/unsuspend/${userId}`,
//         {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (res.ok) {
//         setUsers(
//           users.map((u) =>
//             u._id === userId ? { ...u, isSuspended: false } : u
//           )
//         );
//       } else {
//         const data = await res.json();
//         setError(data.message);
//       }
//     } catch (err) {
//       setError("Error unsuspending user");
//     }
//   };

//   const handleSuspendPost = async (postId) => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/posts/suspend/${postId}`,
//         {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (res.ok) {
//         setAllPosts(
//           allPosts.map((p) =>
//             p._id === postId ? { ...p, isSuspended: true } : p
//           )
//         );
//       } else {
//         const data = await res.json();
//         setError(data.message);
//       }
//     } catch (err) {
//       setError("Error suspending post");
//     }
//   };

//   const handleUnsuspendPost = async (postId) => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/posts/unsuspend/${postId}`,
//         {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (res.ok) {
//         setAllPosts(
//           allPosts.map((p) =>
//             p._id === postId ? { ...p, isSuspended: false } : p
//           )
//         );
//       } else {
//         const data = await res.json();
//         setError(data.message);
//       }
//     } catch (err) {
//       setError("Error unsuspending post");
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (res.ok) {
//         setComments(comments.filter((c) => c._id !== commentId));
//       } else {
//         const data = await res.json();
//         setError(data.message);
//       }
//     } catch (err) {
//       setError("Error deleting comment");
//     }
//   };

 

//   const conditionalRendering =()=>{
//     if(error) return <div className="text-red-400 font-bold text-sm w-full h-full flex justify-center items-center ">{error.message}</div>
//     if(loading) return <div className="w-full h-full flex items-center justify-center"><BeatLoader /></div> 
//     if(activeTab=="users") return <UserManagement data={tabData}  />
//     if(activeTab=="posts") return <PostManagement data={tabData}  />
//     if(activeTab=="comments") return <CommentManagement data={tabData}  />
//   }

// return (<>
// <div className="w-full flex h-full">

// <div className="flex-1 h-full bg-gray-200 ml-[10rem]">
// {
//   conditionalRendering()
// }
// </div>
// </div>



// </>)

// }


//Redirect to /dasboard/users by default


export default function DefaultTab(){
  const router =useRouter();
  const {user}= useAuth()
   useEffect(()=>{
    if (!user || user?.role !="admin") {
      //  router.push("/login");
      //Fo development only else this line should be deleted
         router.push("dashboard/users")

        } else {
             router.push("dashboard/users")
       } 
},[])
return null
}