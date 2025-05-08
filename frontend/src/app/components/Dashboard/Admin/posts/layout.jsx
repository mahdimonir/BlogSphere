import DashboardHeader from  '../../../components/dashboardHeader'


const tabs=[
    {key:"allPosts",label:"All posts",href:"/dashboard/posts/allPosts"},
    {key:"pendingPosts",label:"Pending posts",href:"/dashboard/posts/pending"},
    {key:"suspendPosts",label:"Suspend posts",href:"/dashboard/posts/suspendPosts"},

]


export default async function Layout({children}){

return( <div className="w-full p-3 bg-white rounded-md">
    <div className="flex border-b py-1 border-gray-200 ">
       <DashboardHeader tabs={tabs} />
    </div>
    <div className="w-full p-3">
        {
            children
        }
    </div>


</div>
)


}