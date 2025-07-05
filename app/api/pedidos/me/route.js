import connectToDatabase from '@/lib/db';
import Pedido from '@/lib/models/Pedido';

export async function GET(request) {
  const cookie = request.cookies.get('session')?.value;
  let session = null;
  try {
    session = cookie && JSON.parse(decodeURIComponent(cookie));
  } catch { }
  if (!session?.studentId) {
    return new Response(JSON.stringify({ error: 'No has ingresado a tu cuenta' }), { status: 401 });
  }
  await connectToDatabase();
  const pedidos = await Pedido.find({ studentId: session.studentId })
    .sort({ createdAt: -1 });
  return new Response(JSON.stringify(pedidos), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}