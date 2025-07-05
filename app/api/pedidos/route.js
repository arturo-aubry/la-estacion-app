// app/api/pedidos/route.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Pedido from '../../../lib/models/Pedido';
import { apiRateLimiter } from '../../../lib/rate-limit';

export async function POST(request) {
  // ————— Rate limit —————
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    await apiRateLimiter.consume(ip);
  } catch {
    return NextResponse.json(
      { error: 'Demasiados envíos, prueba de nuevo en unos segundos.' },
      { status: 429 }
    );
  }

  try {
    const data = await request.json();

    // 1) Genera orderId único
    data.orderId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 2) Leer sesión de la cookie
    const cookie = request.cookies.get('session')?.value;
    let session = null;
    try {
      session = cookie && JSON.parse(decodeURIComponent(cookie));
    } catch { }
    if (!session?.studentId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }
    data.studentId = session.studentId;

    // 3) Conectar a la base de datos
    await connectToDatabase();

    // 4) Crear y guardar el pedido
    const nuevoPedido = await Pedido.create({
      orderId: data.orderId,
      tiritaOCrotones: data.tiritaOCrotones,
      pasta: data.pasta,
      proteinas: data.proteinas,
      vegetales: data.vegetales,
      semillas: data.semillas,
      aderezos: data.aderezos,
      calificacion: data.calificacion,
      studentId: data.studentId
    });

    return NextResponse.json(nuevoPedido, { status: 201 });
  } catch (error) {
    console.error('[pedidos] ERROR', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}