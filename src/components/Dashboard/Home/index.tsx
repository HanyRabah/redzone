"use client"
import HeroSectionForm from "@/components/Dashboard/_Components/HeroSectionForm";
import AboutUsSectionForm from "@/components/Dashboard/About/Forms/AboutUsSectionForm";
import ClientsManager from "@/components/Dashboard/Clients";
import TestimonialsManager from "@/components/Dashboard/Testimonials";
import Portfolio from "@/components/Dashboard/Home/Components/Portfolio";
import PageTitle from "@/components/Dashboard/_Layout/PageTitle";
import EnhancedTabs from "@/components/Dashboard/_Layout/Tabs";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const HomePage = ({ data }) => {
  const [value, setValue] = useState(0);
  const params = useSearchParams();
  const tab = params?.get("tab");

  const tabs = [
    { label: "Hero Section", value: 0 },
    { label: "About Section", value: 1 },
    { label: "Portfolio Section", value: 2 },
    { label: "Clients Section", value: 3 },
    { label: "Testimonials Section", value: 4 },
  ]

  useEffect(() => {
    if(tab) {
      setValue(Number(tab));
    }
  },[tab])

  return (
    <div className="space-y-6">
      <PageTitle
        title="Home Page"
        description="Manage your home page content"
      />

      <EnhancedTabs 
      tabs={tabs}
      defaultValue={value}
      >
        <HeroSectionForm page="home" initialData={data.heroSlider} />
        <AboutUsSectionForm initialData={data.aboutUsSection} />
        <Portfolio projects={data.projects} categories={data.categories} sections={data.sections} />
        <ClientsManager clients={data.clients} sections={data.sections} />
        <TestimonialsManager testimonials={data.testimonials} />
      </EnhancedTabs>
    </div>
  );
};

export default HomePage;
