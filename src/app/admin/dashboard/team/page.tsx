import TeamSectionManager from "@/components/admin/managers/TeamSectionManager"
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

const TeamPage = async () => {
    const { teamMembers, teamSection } = await getTeamMembers();
    console.log(teamMembers, teamSection);
    return <TeamSectionManager teamSection={teamSection} teamMembers={teamMembers} />
}

export default TeamPage