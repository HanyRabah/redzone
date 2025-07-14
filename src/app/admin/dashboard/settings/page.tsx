// app/admin/settings/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import SettingsTabs from "@/components/admin/Tabs/SettingsTabs";

async function getSettingsData() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const [siteSettings, users] = await Promise.all([
    prisma.siteSettings.findMany(),
    prisma.user.findMany(),
  ]);

  return {
    siteSettings,
    users,
  };
}

export default async function SettingsPage() {
  const {siteSettings, users} = await getSettingsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your site settings and preferences
        </p>
      </div>
      <SettingsTabs siteSettings={siteSettings} users={users} />
    </div>
  );
}
