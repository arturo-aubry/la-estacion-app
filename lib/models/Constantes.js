import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

// Schema genérico para una constante con nombre único
const itemSchema = new Schema({
  name: { type: String, unique: true, required: true }
});

export const Vegetal = models.Vegetal || model('Vegetal', itemSchema);
export const Semilla = models.Semilla || model('Semilla', itemSchema);
export const Proteina = models.Proteina || model('Proteina', itemSchema);
export const Aderezo = models.Aderezo || model('Aderezo', itemSchema);