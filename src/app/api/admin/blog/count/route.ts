import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.blogPost.count();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog count:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog count" },
      { status: 500 }
    );
  }
}
        