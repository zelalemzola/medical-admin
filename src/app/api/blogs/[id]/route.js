import { connectdb } from '@/lib/config/db';
import Blog from '@/lib/models/Blog';
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function PUT(request) {
  const { title, thumbnailUrl, thumbnailKey, date, content } = await request.json();
  const id = request.nextUrl.pathname.split('/').pop();
  const blog = await Blog.findByIdAndUpdate(
    id,
    { title, thumbnailUrl, thumbnailKey, date, content },
    { new: true, runValidators: true }
  );
  return NextResponse.json({ blog });
}

export async function DELETE(request) {
  const id = request.nextUrl.pathname.split('/').pop();
  await Blog.findByIdAndDelete(id);
  return NextResponse.json({ msg: 'Blog Deleted' });
}
