"use client";
import HeroSectionForm from "@/components/Dashboard/_Components/HeroSectionForm";
import ContactDetailsForm from "@/components/Dashboard/Contact/Forms/ContactDetailsForm";
import PageTitle from "../_Layout/PageTitle";
import EnhancedTabs from "../_Layout/Tabs";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ContactSubmissionsManager from "./Components/ContactSubmissions";
import ContactStatsOverview from "./Components/ContactStatsOverview";

const tabs = [
  { label: "Hero Section", value: 0 },
  { label: "Contact Details", value: 1 },
  { label: "Form Statistics", value: 2 },
  { label: "Form Submissions", value: 3 },
];

export default function ContactPage({ data }) {
  const [value, setValue] = useState(0);
  const params = useSearchParams();
  const tab = params?.get("tab");

  useEffect(() => {
    if (tab) {
      setValue(Number(tab));
    }
  }, [tab]);

  const stats = {
    total: data.submissions.length,
    unread: data.submissions.filter((s) => !s.isRead).length,
    replied: data.submissions.filter((s) => s.isReplied).length,
    recent: data.submissions.slice(0, 5),
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Contact Page"
        description="Manage contact page content and form submissions"
      />
      <EnhancedTabs tabs={tabs} defaultValue={value}>
        <HeroSectionForm page="contact" initialData={data.heroSlider} />
        <ContactDetailsForm initialData={data.contactDetails} />
        <ContactStatsOverview submissions={data.submissions} stats={stats} />
        <ContactSubmissionsManager submissions={data.submissions} />
      </EnhancedTabs>
    </div>
  );
}
