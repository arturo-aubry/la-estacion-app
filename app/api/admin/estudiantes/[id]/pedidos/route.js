import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Pedido from '@/lib/models/Pedido';

export async function GET(request, { params }) {
  const { id } = params; // id es el studentId

  await connectToDatabase();

  const pedidos = await Pedido.find({ studentId: id }).lean();

  return NextResponse.json(pedidos);
}