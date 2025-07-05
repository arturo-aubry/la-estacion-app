import connectToDatabase from '@/lib/db';
import Pedido from '@/lib/models/Pedido';

export async function DELETE(request, { params }) {
  const { id } = params;    // viene de /api/pedidos/:id
  await connectToDatabase();

  const result = await Pedido.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    // sin contenido, pero status 204 = OK
    return new Response(null, { status: 204 });
  }

  // si no eliminó nada, devolvemos 404 con JSON
  return new Response(
    JSON.stringify({ error: 'Pedido no encontrado.' }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}