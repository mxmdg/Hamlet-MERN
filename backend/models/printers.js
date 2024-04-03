const { Schema, model, default: mongoose } = require("mongoose");

const printerSchema = new Schema({
  Modelo: { type: String, required: true },
  Fabricante: { type: String, required: false },
  Colores: { type: Number, required: true },
  X_Minimo: { type: Number, required: true },
  X_Maximo: { type: Number, required: true },
  Y_Minimo: { type: Number, required: true },
  Y_Maximo: { type: Number, required: true },
  Paginas_por_minuto: { type: Number, required: true },
  Costo_impresion: { type: Number, required: true },
  Fecha: { type: Date, default: Date.now, required: false },
});

module.exports.esquema = model("Printers", printerSchema);
module.exports.clase = printerSchema;
