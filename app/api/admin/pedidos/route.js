import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db';
import Pedido from '../../../../lib/models/Pedido';

export async function GET() {
  await connectToDatabase();
  const pedidos = await Pedido.find().lean();
  return NextResponse.json(pedidos);
}