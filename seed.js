// seed.js
import 'dotenv/config';
import connectToDatabase from './lib/db.js';
import Vegetal  from './lib/models/Vegetal.js';
import Semilla  from './lib/models/Semilla.js';
import Proteina from './lib/models/Proteina.js';
import Aderezo  from './lib/models/Aderezo.js';

const VEGETALES = [
  'pimientos','elotes','jitomate','zetas','jicama',
  'zanahoria','brocoli','aceitunas','pepino'
];
const SEMILLAS = [
  'chícharo','cacahuate garapiñado','girasol',
  'girasol garapiñado','cacahuate salado'
];
const PROTEINAS = [
  'pollo asado','pollo bbq','pollo curry','huevo',
  'queso panela','queso manchego','pollo chipotle',
  'surimi','jamón'
];
const ADEREZOS = [
  'oliva','cesar','cilantro','mostaza miel','soya'
];

async function seed() {
  await connectToDatabase();
  await Promise.all(VEGETALES.map(name =>
    Vegetal.updateOne({ name }, { name }, { upsert: true })
  ));
  await Promise.all(SEMILLAS.map(name =>
    Semilla.updateOne({ name }, { name }, { upsert: true })
  ));
  await Promise.all(PROTEINAS.map(name =>
    Proteina.updateOne({ name }, { name }, { upsert: true })
  ));
  await Promise.all(ADEREZOS.map(name =>
    Aderezo.updateOne({ name }, { name }, { upsert: true })
  ));
  console.log('✅ Seed completo');
  process.exit();
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});