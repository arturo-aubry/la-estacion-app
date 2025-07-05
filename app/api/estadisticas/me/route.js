// app/api/estadisticas/me/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db';
import Pedido from '../../../../lib/models/Pedido';

export async function GET(request) {
  // 1) Leer sesión
  const cookie = request.cookies.get('session')?.value;
  let session = null;
  try {
    session = cookie && JSON.parse(decodeURIComponent(cookie));
  } catch {}
  if (!session?.studentId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  await connectToDatabase();
  const sid = session.studentId;

  // total de órdenes
  const total = await Pedido.countDocuments({ studentId: sid });

  // top 3 proteínas
  const topProteinas = await Pedido.aggregate([
    { $match: { studentId: sid } },
    { $unwind: '$proteinas' },
    { $group: { _id: '$proteinas', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);

  // top 3 vegetales
  const topVegetales = await Pedido.aggregate([
    { $match: { studentId: sid } },
    { $unwind: '$vegetales' },
    { $group: { _id: '$vegetales', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);

  // top 3 aderezos
  const topAderezos = await Pedido.aggregate([
    { $match: { studentId: sid } },
    { $unwind: '$aderezos' },
    { $group: { _id: '$aderezos', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);

  // top 3 semillas
  const topSemillas = await Pedido.aggregate([
    { $match: { studentId: sid } },
    { $unwind: '$semillas' },
    { $group: { _id: '$semillas', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);

  // conteo tiritas/crotones
  const tiritaCounts = await Pedido.aggregate([
    { $match: { studentId: sid } },
    { $group: { _id: '$tiritaOCrotones', count: { $sum: 1 } } }
  ]);

  // conteo pasta
  const pastaCounts = await Pedido.aggregate([
    { $match: { studentId: sid } },
    { $group: { _id: '$pasta', count: { $sum: 1 } } }
  ]);

  return NextResponse.json({
    total,
    topProteinas:   topProteinas.map(x => ({ name: x._id, count: x.count })),
    topVegetales:   topVegetales.map(x => ({ name: x._id, count: x.count })),
    topAderezos:    topAderezos.map(x => ({ name: x._id, count: x.count })),
    topSemillas:    topSemillas.map(x => ({ name: x._id, count: x.count })),
    tiritaCounts:   tiritaCounts.reduce((o, x) => ({ ...o, [x._id]: x.count }), {}),
    pastaCounts:    pastaCounts.reduce((o, x) => ({ ...o, [x._id]: x.count }), {}),
  });
}