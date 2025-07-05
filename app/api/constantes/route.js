// app/api/constantes/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Vegetal  from '../../../lib/models/Vegetal';
import Semilla  from '../../../lib/models/Semilla';
import Proteina from '../../../lib/models/Proteina';
import Aderezo  from '../../../lib/models/Aderezo';

export async function GET() {
  await connectToDatabase();

  const [vegetales, semillas, proteinas, aderezos] = await Promise.all([
    Vegetal.find().sort('name').lean(),
    Semilla.find().sort('name').lean(),
    Proteina.find().sort('name').lean(),
    Aderezo.find().sort('name').lean(),
  ]);

  return NextResponse.json({ vegetales, semillas, proteinas, aderezos });
}