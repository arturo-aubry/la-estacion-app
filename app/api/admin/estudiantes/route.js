import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/lib/models/Student';

export async function GET() {
  await connectToDatabase();
  const list = await Student.find({})
    .sort({ createdAt: 1 })
    .select('studentId isAdmin createdAt lastLogin')
    .lean();
  return NextResponse.json(list);
}

export async function POST(request) {
  const { studentId, pin, isAdmin } = await request.json();
  await connectToDatabase();
  try {
    const created = await Student.create({ studentId, pin, isAdmin: !!isAdmin });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Ya existe esa Clave Única.' }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}