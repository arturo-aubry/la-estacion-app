import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Pedido from '@/lib/models/Pedido';

export async function GET() {
  await connectToDatabase();

  const total = await Pedido.countDocuments();

  const aggTop = async (field, limit = 3) =>
    (await Pedido.aggregate([
      { $unwind: `$${field}` },
      { $group: { _id: `$${field}`, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ])).map(x => ({ name: x._id, count: x.count }));

  const topProteinas = await aggTop('proteinas', 3);
  const topVegetales = await aggTop('vegetales', 3);
  const topAderezos = await aggTop('aderezos', 3);
  const topSemillas = await aggTop('semillas', 3);

  const tiritaCounts = (await Pedido.aggregate([
    { $group: { _id: '$tiritaOCrotones', count: { $sum: 1 } } }
  ])).reduce((o, x) => ({ ...o, [x._id]: x.count }), {});

  const pastaCounts = (await Pedido.aggregate([
    { $group: { _id: '$pasta', count: { $sum: 1 } } }
  ])).reduce((o, x) => ({ ...o, [x._id]: x.count }), {});

  return NextResponse.json({
    total,
    topProteinas,
    topVegetales,
    topAderezos,
    topSemillas,
    tiritaCounts,
    pastaCounts
  });
}