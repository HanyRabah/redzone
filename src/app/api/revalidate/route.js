import { revalidatePath } from 'next/cache';

export async function POST(request) {
  const { path } = await request.json();
  
  try {
    revalidatePath(path);
    return Response.json({ revalidated: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Error revalidating' }, { status: 500 });
  }
}