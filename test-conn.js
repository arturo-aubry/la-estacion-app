import 'dotenv/config';
import mongoose from 'mongoose';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('🎉 Conexión directa exitosa');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error en conexión directa:', err);
    process.exit(1);
  });