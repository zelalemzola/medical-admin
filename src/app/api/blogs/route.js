import { connectdb } from '@/lib/config/db';
import Blog from '@/lib/models/Blog';
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function GET(request) {
  const blogs = await Blog.find();
  return NextResponse.json({ blogs });
}

export async function POST(request) {
  const { title, thumbnailUrl, thumbnailKey, date, content } = await request.json();
  const blog = await Blog.create({ title, thumbnailUrl, thumbnailKey, date, content });
  return NextResponse.json({ blog });
}
