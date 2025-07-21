"use client";
import HeroSectionForm from "@/components/Dashboard/_Components/HeroSectionForm";
import PortfolioProjectsManager from "@/components/Dashboard/Portfolio/Managers/PortfolioProjectsManager";
import PortfolioCategories from "@/components/Dashboard/Portfolio/Components/PortfolioCategories";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageTitle from "@/components/Dashboard/_Layout/PageTitle";
import EnhancedTabs from "@/components/Dashboard/_Layout/Tabs";

const  PortfolioPage = ({ data }) => {
  const [value, setValue] = useState(0);
  const params = useSearchParams();
  const tab = params?.get("tab");

  const tabs = [
    { label: "Hero Slider", value: 0 },
    { label: "Projects", value: 1 },
    { label: "Categories", value: 2 },
  ]

  useEffect(()=> {
    if(tab) {
      setValue(Number(tab));
    }
  },[tab])

  return (
    <div className="space-y-6">
      <PageTitle
        title="Portfolio Page"
        description="Manage your portfolio page content"
      />

      <EnhancedTabs 
        tabs={tabs}
        defaultValue={value}
      >
        <HeroSectionForm page="portfolio" initialData={data.heroSlider} />
        <PortfolioProjectsManager projects={data.projects} categories={data.categories} sections={data.sections} />
        <PortfolioCategories categories={data.categories} projects={data.projects} />
      </EnhancedTabs>   
    </div>
  );
};

export default PortfolioPage;
