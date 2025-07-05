import mongoose from 'mongoose';
const { Schema, models, model } = mongoose;

const PedidoSchema = new Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  tiritaOCrotones: {
    type: String,
    enum: ['tiritas', 'crotones', 'ninguna', 'ambas'],
    required: true
  },
  pasta: {
    type: String,
    enum: ['sí', 'no'],
    required: true
  },
  proteinas: [String],
  vegetales: [String],
  semillas: [String],
  aderezos: [String],
  calificacion: Number,
  studentId: String
}, { timestamps: true });

// Helper para generar ID único
async function generateUniqueOrderId(Model) {
  const id = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const exists = await Model.exists({ orderId: id });
  return exists ? generateUniqueOrderId(Model) : id;
}

// pre-validate hook para asignarlo automáticamente
PedidoSchema.pre('validate', async function(next) {
  if (!this.orderId) {
    this.orderId = await generateUniqueOrderId(this.constructor);
  }
  next();
});

export default models.Pedido || model('Pedido', PedidoSchema);