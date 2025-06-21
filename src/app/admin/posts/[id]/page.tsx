import PostEditor from '@/components/admin/PostEditor';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditPost({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.blog.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  return <PostEditor initialData={post} />;
}
