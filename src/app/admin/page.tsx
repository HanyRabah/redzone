import { prisma } from '@/lib/prisma';
import DashboardUI from './components/DashboardUI';

async function getData() {
  const [pageCount, postCount, userCount] = await Promise.all([
    prisma.page.count(),
    prisma.blog.count(),
    prisma.user.count(),
  ]);
  return { pageCount, postCount, userCount };
}

export default async function AdminDashboard() {
  const data = await getData();
  return <DashboardUI {...data} />;
}
