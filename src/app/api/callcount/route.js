import { connectdb } from '@/lib/config/db';
import CallCount from '@/lib/models/CallCount';
import { NextResponse } from 'next/server';

const LoadDB = async () => {
  await connectdb();
};
LoadDB();

export async function GET(request) {
  const callCounts = await CallCount.find();
  return NextResponse.json({ callCounts });
}

export async function POST(request) {
  const { numberOfCalls } = await request.json();
  const callCount = await CallCount.create({ numberOfCalls });
  return NextResponse.json({ callCount });
}
