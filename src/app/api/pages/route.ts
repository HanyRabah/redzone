import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const pages = await prisma.page.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const json = await request.json();
  const { title, content, slug, metaTitle, metaDesc, published } = json;

  const page = await prisma.page.create({
    data: {
      title,
      content,
      slug,
      metaTitle,
      metaDesc,
      published,
    },
  });

  return NextResponse.json(page);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const json = await request.json();
  const { id, title, content, slug, metaTitle, metaDesc, published } = json;

  const page = await prisma.page.update({
    where: { id },
    data: {
      title,
      content,
      slug,
      metaTitle,
      metaDesc,
      published,
    },
  });

  return NextResponse.json(page);
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

  await prisma.page.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}
