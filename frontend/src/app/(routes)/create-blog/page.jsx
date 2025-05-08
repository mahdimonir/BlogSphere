"use client";
import CreateBlogForm from "@/app/components/CreateBlogForm";
import Sidebar from "@/app/components/Sidebar";

export default function CreateBlog() {
  return (
    <div className="min-h-screen flex bg-black">
      <Sidebar />
      <main className="flex-grow overflow-y-auto">
        <CreateBlogForm />
      </main>
    </div>
  );
}
