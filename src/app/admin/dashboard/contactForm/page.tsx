// app/admin/contact/page.tsx
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactSubmissionsManager from "@/components/admin/managers/ContactSubmissionsManager";
import ContactStatsOverview from "@/components/admin/components/ContactStatsOverview";

async function getContactData() {
  const [heroSlider, contactDetails, submissions] = await Promise.all([
    prisma.heroSlider.findUnique({
      where: { page: "contact" },
      include: {
        slides: true,
      },
    }),
    prisma.contactDetails.findFirst(),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    heroSlider,
    contactDetails,
    submissions,
  };
}

export default async function ContactManager() {
  const data = await getContactData();

  const stats = {
    total: data.submissions.length,
    unread: data.submissions.filter((s) => !s.isRead).length,
    replied: data.submissions.filter((s) => s.isReplied).length,
    recent: data.submissions.slice(0, 5),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Contact Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage contact page content and form submissions
        </p>
      </div>

      <ContactStatsOverview submissions={data.submissions} stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Contact Form Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactSubmissionsManager submissions={data.submissions} />
        </CardContent>
      </Card>
    </div>
  );
}
