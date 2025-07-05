// middleware.js
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/_next/',
  '/favicon.ico',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout'
];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1) Lee la cookie de sesión
  const raw = req.cookies.get('session')?.value;
  let session = null;
  try {
    session = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error parseando sesión:', e, 'raw:', raw);
    session = null;
  }

  // 2) Rutas públicas (no requieren autenticación)
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 3) Protección de rutas /admin
  if (pathname.startsWith('/admin')) {
    if (!session?.studentId) {
      // No autenticado → redirige a login
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (!session.isAdmin) {
      // Autenticado pero no admin → redirige a la página principal
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // 4) Rutas privadas fuera de /admin → requieren estar autenticado
  if (!session?.studentId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', 
    '/pedidos/:path*', 
    '/api/pedidos/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/estadisticas/:path*',
    '/api/admin/pedidos/:path*'
  ],
};