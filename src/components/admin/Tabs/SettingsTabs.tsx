"use client"; // app/admin/settings/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteSettingsForm from "@/components/admin/forms/SiteSettingsForm";
import UsersManager from "@/components/admin/managers/UsersManager";
import { Box, Divider, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { SiteSettings, User } from "@prisma/client";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface SettingsTabsProps {
    siteSettings: SiteSettings[]
    users: User[];
}
export default function SettingsTabs({ siteSettings, users }: SettingsTabsProps) {
  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box>
        <Tabs
          defaultValue={0}
          className="space-y-6"
          onChange={handleTabChange}
          value={value}
        >
          <Tab label="Site Settings" {...a11yProps(0)} />
          <Tab label="Users" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Divider />
      <CustomTabPanel value={value} index={0}>
        <Card>
          <CardHeader>
            <CardTitle>Site Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <SiteSettingsForm settingsData={siteSettings} />
          </CardContent>
        </Card>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersManager users={users} />
          </CardContent>
        </Card>
      </CustomTabPanel>
    </>
  );
}
