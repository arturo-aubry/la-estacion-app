import mongoose from 'mongoose';
const { Schema, models, model } = mongoose;

const AderezoSchema = new Schema({
  name: { type: String, unique: true, required: true }
});

export default models.Aderezo || model('Aderezo', AderezoSchema);