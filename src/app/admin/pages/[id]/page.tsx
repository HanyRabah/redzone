import PageEditor from '@/components/admin/PageEditor';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditPage({
  params,
}: {
  params: { id: string };
}) {
  const page = await prisma.page.findUnique({
    where: { id: params.id },
  });

  if (!page) {
    notFound();
  }

  return <PageEditor initialData={page} />;
}
