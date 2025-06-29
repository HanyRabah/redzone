import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const json = await request.json();
  const { title, content, slug, excerpt, image } = json;

  const post = await prisma.blogPost.create({
    data: {
      title,
      content,
      slug,
      excerpt,
      image,
      publishedAt: new Date(),
    },
  });

  return NextResponse.json(post);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const json = await request.json();
  const { id, title, content, slug, excerpt, image } = json;

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      content,
      slug,
      excerpt,
      image,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing id', { status: 400 });
  }

  await prisma.blogPost.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}
