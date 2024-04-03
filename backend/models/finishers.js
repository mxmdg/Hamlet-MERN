const { Schema, model, default: mongoose } = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const finisherSchema = new Schema({
  Modelo: { type: String, required: false },
  Fabricante: { type: String, required: false },
  Proceso: { type: String, required: true },
  X_Minimo: { type: Number, required: true },
  X_Maximo: { type: Number, required: true },
  Y_Minimo: { type: Number, required: true },
  Y_Maximo: { type: Number, required: true },
  Velocidad: { type: String, required: false },
  Costo: { type: mongoose.Schema.ObjectId, ref: "precios", required: true },
  Unidad: { type: String, required: true },
  Fecha: { type: Date, default: Date.now, required: false },
});

finisherSchema.virtual("formula").get(function () {
  console.log(this.Costo, this.Unidad);
  return this.Costo * this.Unidad; // Esto habrá que revisarlo para ver como aplicar distintas formulas a cada proceso
});

module.exports.esquema = model("Finishers", finisherSchema);
module.exports.clase = finisherSchema;
