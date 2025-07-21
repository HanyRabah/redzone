"use client"; // app/admin/settings/page.tsx
import SiteSettingsForm from "@/components/Dashboard/Settings/Forms/SiteSettingsForm";
import UsersManager from "@/components/Dashboard/Users";
import { SiteSettings, User } from "@prisma/client";
import EnhancedTabs from "../_Layout/Tabs";

interface SettingsTabsProps {
  siteSettings: SiteSettings[];
  users: User[];
}
export default function SettingsPage({
  siteSettings,
  users,
}: SettingsTabsProps) {
  return (
    <>
      <EnhancedTabs
        tabs={[
          { label: "Site Settings", value: 0 },
          { label: "Users", value: 1 },
        ]}
        defaultValue={0}
      >
        <SiteSettingsForm settingsData={siteSettings} />
        <UsersManager users={users} />
      </EnhancedTabs>
    </>
  );
}
