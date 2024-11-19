import { connectdb } from '@/lib/config/db';
import CallCount from '@/lib/models/CallCount';
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function PUT(request) {
  const { numberOfCalls } = await request.json();
  const id = request.nextUrl.pathname.split('/').pop();
  const callCount = await CallCount.findByIdAndUpdate(
    id,
    { numberOfCalls },
    { new: true, runValidators: true }
  );
  return NextResponse.json({ callCount });
}

export async function DELETE(request) {
  const id = request.nextUrl.pathname.split('/').pop();
  await CallCount.findByIdAndDelete(id);
  return NextResponse.json({ msg: 'Call Count Deleted' });
}
