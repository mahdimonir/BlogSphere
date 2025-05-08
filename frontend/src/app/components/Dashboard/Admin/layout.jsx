

import Breadcrumbs from "@/app/components/breadCrumbs";
import { LayoutGridIcon } from "lucide-react";
import Link from "next/link";

const tabs=[
    {key:"users",label:"Users",href:"/dashboard/users"},
    {key:"posts",label:"Posts",href:"/dashboard/posts"},
  ]

export default function Layout({ children }) {
  return (
      <div className="flex w-full h-full">
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 w-[10rem] h-full bg-white shadow pt-2">
          <p className="flex font-bold items-center gap-1 px-3 text-sm ">
            <LayoutGridIcon size={20} />Dashboard
          </p>
          <nav className="pt-5 relative flex flex-col gap-2 h-full ">
            {tabs.map((tab) => {
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={`cursor-pointer px-3 py-1 rounded hover:bg-gray-200
                `}
                >
                  {tab.label}
                </Link>
              );
            })}
            <div className="z-50 mt-[auto] px-3 cursor-pointer text-white bg-red-400">Logout</div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="pl-[10rem] m-w-[70rem] w-full min-h-screen bg-gray-100">
          <div className="p-5">
            <Breadcrumbs />
          </div>

          <div className="">{children}</div>
        </main>
      </div>
  );
}
