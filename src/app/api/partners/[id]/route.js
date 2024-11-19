import { connectdb } from '@/lib/config/db';
import Partner from '@/lib/models/Partner';
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function PUT(request) {
  const { name, photoUrl, photoKey } = await request.json();
  const id = request.nextUrl.pathname.split('/').pop();
  const partner = await Partner.findByIdAndUpdate(
    id,
    { name, photoUrl, photoKey },
    { new: true, runValidators: true }
  );
  return NextResponse.json({ partner });
}

export async function DELETE(request) {
  const id = request.nextUrl.pathname.split('/').pop();
  await Partner.findByIdAndDelete(id);
  return NextResponse.json({ msg: 'Partner Deleted' });
}
