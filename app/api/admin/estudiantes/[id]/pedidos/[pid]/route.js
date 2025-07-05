import { NextResponse } from 'next/server'
import connectToDatabase from '../../../../../../lib/db';
import Pedido            from '../../../../../../lib/models/Pedido';

export async function DELETE(request, { params }) {
  const { pid } = params  // aquí pid es el _id del pedido

  await connectToDatabase()

  const result = await Pedido.deleteOne({ _id: pid })
  if (result.deletedCount === 0) {
    return NextResponse.json(
      { error: 'Pedido no encontrado.' },
      { status: 404 }
    )
  }

  // 204 No Content indica éxito sin cuerpo
  return new NextResponse(null, { status: 204 })
}