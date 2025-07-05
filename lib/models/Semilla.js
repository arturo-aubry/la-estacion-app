import mongoose from 'mongoose';
const { Schema, models, model } = mongoose;

const SemillaSchema = new Schema({
  name: { type: String, unique: true, required: true }
});

export default models.Semilla || model('Semilla', SemillaSchema);