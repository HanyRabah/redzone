"use client";
import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useSearchParams } from "next/navigation";

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

const EnhancedTabs = ({
  tabs,
  defaultValue = 0,
  children,
}: {
  tabs: { label: string; value: number }[];
  defaultValue: number;
  children: React.ReactNode;
}) => {
  const [value, setValue] = useState(defaultValue);
  const params = useSearchParams();
  const tab = params?.get("tab");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (tab) {
      setValue(Number(tab));
    }
  }, [tab]);

  const tabsContent = React.Children.toArray(children).map((child, index) => (
    <CustomTabPanel key={index} value={value} index={index}>
      {child}
    </CustomTabPanel>
  ));

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-label="basic tabs example"
          value={value}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {tabsContent}
    </div>
  );
};

export default EnhancedTabs;
