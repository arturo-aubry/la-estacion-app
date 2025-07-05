import mongoose from 'mongoose';
const { Schema, models, model } = mongoose;

const VegetalSchema = new Schema({
  name: { type: String, unique: true, required: true }
});

export default models.Vegetal || model('Vegetal', VegetalSchema);