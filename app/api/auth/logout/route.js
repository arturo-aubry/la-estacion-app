import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const loginUrl = new URL('/login', request.url);

    const res = NextResponse.redirect(loginUrl);

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