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

  // // Convert array to object for easier access
  // const settingsObject = siteSettings.reduce(
  //   (acc, setting) => {
  //     acc[setting.key] = setting.value;
  //     return acc;
  //   },
  //   {} as SiteSettings[]
  // );

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
     
        {/* <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <UserProfileForm initialData={data.userProfile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <SecuritySettingsForm />
            </CardContent>
          </Card>
        </TabsContent> */}
    </div>
  );
}
