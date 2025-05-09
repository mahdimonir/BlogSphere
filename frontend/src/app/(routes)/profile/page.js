import ProfileSettingsForm from "@/app/components/ProfileSettingsForm";
import ProfileSidebarInfo from "@/app/components/ProfileSidebarInfo";
import Sidebar from "@/app/components/Sidebar";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white">
      <Sidebar />
      <main className="flex p-6 gap-12 w-full">
        <ProfileSidebarInfo />
        <ProfileSettingsForm />
      </main>
    </div>
  );
}
