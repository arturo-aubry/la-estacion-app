// app/api/estadisticas/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db';
import Pedido from '../../../../lib/models/Pedido';

export async function GET(request, { params }) {
  const { id } = params; // aquí id === studentId

  await connectToDatabase();

  // 1) total de órdenes
  const total = await Pedido.countDocuments({ studentId: id });

  // 2) conteos de tiritaOCrotones y pasta
  const tiritas = await Pedido.countDocuments({ studentId: id, tiritaOCrotones: 'tiritas' });
  const crotones = await Pedido.countDocuments({ studentId: id, tiritaOCrotones: 'crotones' });
  const ambas    = await Pedido.countDocuments({ studentId: id, tiritaOCrotones: 'ambos' });
  const ninguna  = await Pedido.countDocuments({ studentId: id, tiritaOCrotones: 'ninguno' });

  const pastaSí = await Pedido.countDocuments({ studentId: id, pasta: 'sí' });
  const pastaNo = total - pastaSí;

  // 3) Top 3 proteins, vegetales, semillas y aderezos
  const aggTop = async field => {
    const res = await Pedido.aggregate([
      { $match: { studentId: id } },
      { $unwind: `$${field}` },
      { $group: { _id: `$${field}`, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);
    return res.map(r => ({ name: r._id, count: r.count }));
  };

  const [topProteinas, topVegetales, topSemillas, topAderezos] = await Promise.all([
    aggTop('proteinas'),
    aggTop('vegetales'),
    aggTop('semillas'),
    aggTop('aderezos'),
  ]);

  return NextResponse.json({
    total,
    tiritaCounts: { tiritas, crotones, ambas, ninguna },
    pastaCounts:  { sí: pastaSí, no: pastaNo },
    topProteinas,
    topVegetales,
    topSemillas,
    topAderezos
  });
}