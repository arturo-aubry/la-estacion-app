import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../lib/db';
import Student from '../../../../../../lib/models/Student';

// GET /api/admin/estudiantes/[id] - obtener un estudiante
export async function GET(request, { params }) {
  const { id } = params;
  await connectToDatabase();
  const student = await Student.findOne({ studentId: id }).lean();
  if (!student) {
    return NextResponse.json({ error: 'Estudiante no encontrado.' }, { status: 404 });
  }
  return NextResponse.json(student);
}

// PUT /api/admin/estudiantes/[id] - actualizar PIN y/o rol de Admin
export async function PUT(request, { params }) {
  const { id } = params; // studentId
  const { pin, isAdmin } = await request.json();

  // Leer sesión para posible reescritura de cookie
  const raw = request.cookies.get('session')?.value;
  let session = null;
  try {
    session = raw ? JSON.parse(raw) : null;
  } catch { }

  await connectToDatabase();
  const student = await Student.findOne({ studentId: id });
  if (!student) {
    return NextResponse.json({ error: 'Estudiante no encontrado.' }, { status: 404 });
  }

  // Actualizar campos
  if (pin !== undefined) {
    student.pin = pin; // virtual para validar y hashear
  }
  if (isAdmin !== undefined) {
    student.isAdmin = isAdmin;
  }
  await student.save();

  // Construir respuesta
  const res = NextResponse.json(student);

  // Si el usuario editado es quien está en sesión, actualizar cookie
  if (session?.studentId === id) {
    const newSession = {
      studentId: student.studentId,
      isAdmin: Boolean(student.isAdmin)
    };
    res.cookies.set({
      name: 'session',
      value: JSON.stringify(newSession),
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24
    });
  }

  return res;
}

// DELETE /api/admin/estudiantes/[id] - eliminar un estudiante
export async function DELETE(request, { params }) {
  const { id } = params;
  await connectToDatabase();
  await Student.deleteOne({ studentId: id });
  return new Response(null, { status: 204 });
}