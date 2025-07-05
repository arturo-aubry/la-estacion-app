// app/api/pedidos/list/route.js
import connectToDatabase from '../../../../lib/db';
import Pedido           from '../../../../lib/models/Pedido';

export async function GET() {
  await connectToDatabase();
  const pedidos = await Pedido.find().sort({ createdAt: -1 });
  return new Response(JSON.stringify(pedidos), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}