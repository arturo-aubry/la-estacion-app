import 'dotenv/config';
import connectToDatabase from 'lib/db.js';
import Pedido from 'lib/models/Pedido.js';

async function addOrderIds() {
  await connectToDatabase();

  const pedidos = await Pedido.find({ orderId: { $exists: false } });

  console.log(`Asignando IDs a ${pedidos.length} pedidos...`);

  for (const p of pedidos) {
    p.orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
    await p.save();
    console.log(`Pedido ${p._id} ➔ ${p.orderId}`);
  }

  console.log('✅ IDs asignados.');
  process.exit();
}

addOrderIds().catch(e => {
  console.error(e);
  process.exit(1);
});