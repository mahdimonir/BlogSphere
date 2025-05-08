import DashboardHeader from "@/app/components/dashboardHeader";

const tabs = [
  { key: "allUsers", label: "All users", href: "/dashboard/users/allUsers" },
  {
    key: "suspendUsers",
    label: "Suspned users",
    href: "/dashboard/users/suspendUsers",
  },
];

export default async function Layout({ children }) {
  return (
    <>
      <div className="w-full p-3 bg-white rounded-md">
        <div className="flex py-2 border-b border-gray-200 ">
          <DashboardHeader tabs={tabs} />
        </div>
        <div className="w-full p-3">{children}</div>
      </div>
    </>
  );
}
