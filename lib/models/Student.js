import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model, models } = mongoose;

const StudentSchema = new Schema({
  studentId: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'La Clave Única es obligatoria.'],
    match: [/^\d{6}$/, 'La Clave Única debe ser de 6 dígitos.']
  },
  pinHash: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

// Virtual para setear y hashear el PIN
StudentSchema.virtual('pin')
  .set(function (pin) {
    if (!/^\d{4}$/.test(pin)) {
      this.invalidate('pin', 'El NIP debe ser de 4 dígitos.');
    }
    this._plainPin = pin;
    this.pinHash = bcrypt.hashSync(pin, 10);
  });

// Método para verificar PIN
StudentSchema.methods.verifyPin = function (pin) {
  return bcrypt.compare(pin, this.pinHash);
};

export default models.Student || model('Student', StudentSchema);
