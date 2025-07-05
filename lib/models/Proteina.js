import mongoose from 'mongoose';
const { Schema, models, model } = mongoose;

const ProteinaSchema = new Schema({
  name: { type: String, unique: true, required: true }
});

export default models.Proteina || model('Proteina', ProteinaSchema);