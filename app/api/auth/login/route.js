// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db';
import Student from '../../../../lib/models/Student';
import { apiRateLimiter } from '../../../../lib/rate-limit';

export async function POST(request) {
  // ————— Rate limit —————
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    await apiRateLimiter.consume(ip);
  } catch {
    return NextResponse.json(
      { error: 'Demasiados intentos de login, prueba en unos segundos.' },
      { status: 429 }
    );
  }

  const { studentId, pin } = await request.json();

  await connectToDatabase();

  // 1) Buscar estudiante
  const student = await Student.findOne({ studentId });
  if (!student) {
    return NextResponse.json(
      { error: 'Estudiante no encontrado' },
      { status: 404 }
    );
  }

  // 2) Verificar PIN
  const valid = await student.verifyPin(pin);
  if (!valid) {
    return NextResponse.json(
      { error: 'PIN incorrecto' },
      { status: 401 }
    );
  }

  // 3) Guardamos fecha/hora de último login
  student.lastLogin = new Date();
  await student.save();

  // 4) Establecer sesión incluyendo isAdmin
  const sessionPayload = {
    studentId: student.studentId,
    isAdmin: student.isAdmin === true
  };

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: 'session',
    value: JSON.stringify(sessionPayload),
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24  // 1 día
  });

  return res;
}