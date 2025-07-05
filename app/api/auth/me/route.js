// app/api/auth/me/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  // 1) Leer la cookie
  const raw = request.cookies.get('session')?.value;
  let session = null;
  try {
    session = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('[me] Error parseando sesión:', e);
    session = null;
  }

  // 2) Si no hay sesión, devolver 401
  if (!session?.studentId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  // 3) Devolver studentId + isAdmin
  return NextResponse.json({
    studentId: session.studentId,
    isAdmin:   !!session.isAdmin
  });
}