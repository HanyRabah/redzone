"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import HeroSectionForm from '@/components/Dashboard/_Components/HeroSectionForm'
import TeamSectionManager from '@/components/Dashboard/About/Managers/TeamSectionManager'

import WeAreCreativeSectionForm from '@/components/Dashboard/About/Forms/WeAreCreativeSectionForm'
import WhoWeAreSectionForm from '@/components/Dashboard/About/Forms/WhoWeAreSectionForm'

import PageTitle from '@/components/Dashboard/_Layout/PageTitle'
import EnhancedTabs from '@/components/Dashboard/_Layout/Tabs'

const tabs = [
  { label: "Hero Slider", value: 0 },
  { label: "Who We Are", value: 1 },
  { label: "Team", value: 3 },
  { label: "We Are Creative", value: 4 },
]

export default function AboutPage({data}) {
  const {heroSlider, whoWeAreSection, teamSection, teamMembers, weAreCreativeSection} = data

  const [value, setValue] = useState(0);
  const params = useSearchParams();
  const tab = params?.get("tab");

  useEffect(()=> {
    if(tab) {
      setValue(Number(tab));
    }
  },[tab])

  return (
    <div className="space-y-6">
      <PageTitle
        title="About Page"
        description="Manage your about page content"
      />
      <EnhancedTabs 
        tabs={tabs}
        defaultValue={value}
      >
        <HeroSectionForm page="about" initialData={heroSlider} />
        <WhoWeAreSectionForm initialData={whoWeAreSection} />
        <TeamSectionManager teamSection={teamSection} teamMembers={teamMembers} />
        <WeAreCreativeSectionForm initialData={weAreCreativeSection} />
     </EnhancedTabs>
    </div>
  )
}