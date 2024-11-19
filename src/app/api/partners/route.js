import { connectdb } from '@/lib/config/db';
import Partner from '@/lib/models/Partner';
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function GET(request) {
  const partners = await Partner.find();
  return NextResponse.json({ partners });
}

export async function POST(request) {
  const { name, photoUrl, photoKey } = await request.json();
  const partner = await Partner.create({ name, photoUrl, photoKey });
  return NextResponse.json({ partner });
}
