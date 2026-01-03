/* const { Schema, model } = require('mongoose');

const pricesSchema = new Schema(
    { 
        'Proceso': {type: String, required: true},
        'Valor': {type: Number, required: true},
        'Minimo': {type: Number, required: true},
        'Entrada': {type: Number, required: false},
        'Historial': [
            {
              Valor: { type: Number, required: false },
              Minimo: { type: Number, required: false },
              Entrada: { type: Number, required: false },
              Fecha: { type: Date, default: Date.now, required: true }
            }
          ],
        'Fecha': {type: Date, default: Date.now, required: false}
    }); 


module.exports.esquema = model('Precios', pricesSchema);
module.exports.clase = pricesSchema; */

const { Schema, model, default: mongoose } = require("mongoose");

const priceHistorySchema = new Schema({
  Valor: { type: Number, required: false },
  Minimo: { type: Number, required: false },
  Entrada: { type: Number, required: false },
  Porcentaje: { type: Number, required: false },
  Fecha: { type: Date, default: Date.now, required: true },
});

const pricesSchema = new Schema({
  Categoria: { type: String, required: true },
  Proceso: { type: String, required: true },
  Valor: { type: Number, required: true },
  Minimo: { type: Number, required: true },
  Entrada: { type: Number, required: false },
  Historial: [priceHistorySchema],
  Fecha: { type: Date, default: Date.now, required: false },
  status: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo",
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: false,
    index: true,
  },
});

pricesSchema.pre("save", function (next) {
  if (this.Historial.length > 1) {
    for (let i = 1; i < this.Historial.length; i++) {
      const prev = this.Historial[i - 1];
      const curr = this.Historial[i];
      curr.Porcentaje = ((curr.Valor - prev.Valor) / prev.Valor) * 100;
    }
  }
  next();
});

module.exports.esquema = model("Precios", pricesSchema);
module.exports.clase = pricesSchema;
