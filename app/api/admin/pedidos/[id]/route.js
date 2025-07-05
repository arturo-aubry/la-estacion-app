import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Pedido from '@/lib/models/Pedido';

export async function DELETE(request, { params }) {
  const { id } = params;
  await connectToDatabase();

  const result = await Pedido.deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    return NextResponse.json(
      { error: 'Pedido no encontrado.' },
      { status: 404 }
    );
  }
  return new NextResponse(null, { status: 204 });
}