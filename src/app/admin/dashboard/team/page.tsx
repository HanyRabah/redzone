import TeamSectionManager from "@/components/Dashboard/About/Managers/TeamSectionManager"
import { prisma } from "@/lib/prisma";

async function getTeamMembers()  {

  const [teamMembers, teamSection] = await Promise.all([
    prisma.teamMember.findMany(),
    prisma.teamSection.findFirst(),
  ]);

  return {
    teamMembers,
    teamSection,
  };
}

export default async function Page() {
    const { teamMembers, teamSection } = await getTeamMembers();
    return <TeamSectionManager teamSection={teamSection} teamMembers={teamMembers} />
}