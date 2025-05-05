

import Breadcrumbs from "@/app/components/breadCrumbs";
import { LayoutGridIcon } from "lucide-react";
import Link from "next/link";

const tabs=[
    {key:"users",label:"Users",href:"/dashboard/users"},
    {key:"posts",label:"Posts",href:"/dashboard/posts"},
    {key:"comments",label:"Comments",href:"/dashboard/comments"}
  ]

export default function Layout({ children }) {
  return (
      <div className="flex w-full h-full">
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 w-[10rem] h-full bg-white shadow pt-2">
          <p className="flex items-center gap-1 px-3 text-sm font-medium">
            <LayoutGridIcon size={20} /> Admin Dashboard
          </p>
          <nav className="pt-5 flex flex-col gap-2">
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
          </nav>
        </aside>

        {/* Main Content */}
        <main className="pl-[10rem] m-w-[70rem] w-full min-h-screen bg-gray-100">
          <div className="p-3">
            <Breadcrumbs />
          </div>

          <div className="">{children}</div>
        </main>
      </div>
  );
}
