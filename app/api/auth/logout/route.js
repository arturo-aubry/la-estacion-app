// app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Construye una URL absoluta a /login
    const loginUrl = new URL('/login', request.url);

    // Redirige a esa URL
    const res = NextResponse.redirect(loginUrl);

    // Borrar la cookie de sesión
    res.cookies.set('session', '', {
      path: '/',
      maxAge: 0,
    });

    return res;
  } catch (err) {
    console.error('[logout] ERROR:', err);
    return NextResponse.json(
      { error: 'No se pudo cerrar sesión' },
      { status: 500 }
    );
  }
}