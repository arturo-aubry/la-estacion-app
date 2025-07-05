// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/lib/models/Student';
import bcrypt from 'bcryptjs';
import { apiRateLimiter } from '@/lib/rate-limit';

export async function POST(request) {
  // ————— Rate limit —————
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    await apiRateLimiter.consume(ip);
  } catch {
    return NextResponse.json(
      { error: 'Demasiados intentos de registro, prueba en unos segundos.' },
      { status: 429 }
    );
  }

  try {
    let { studentId, pin } = await request.json();
    studentId = studentId.trim();
    pin = pin.trim();

    // 1) Validaciones de formato
    if (!/^\d{6}$/.test(studentId)) {
      return NextResponse.json(
        { error: 'La Clave Única debe tener 6 dígitos' },
        { status: 400 }
      );
    }
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'El PIN debe tener 4 dígitos' },
        { status: 400 }
      );
    }

    // 2) Conectar y comprobar duplicado
    await connectToDatabase();
    const exists = await Student.exists({ studentId });
    if (exists) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con esta Clave Única' },
        { status: 409 }
      );
    }

    // 3) Crear cuenta
    const pinHash = await bcrypt.hash(pin, 10);
    await Student.create({ studentId, pinHash });

    return NextResponse.json({ ok: true }, { status: 201 });

  } catch (err) {
    console.error('[register] ERROR inesperado', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}