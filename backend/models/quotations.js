const { Schema, model } = require("mongoose");

const quotationsSchema = new Schema({
  Job: { type: mongoose.Schema.ObjectId, ref: "Jobs" },
  cost: { type: Number, required: true },
  Fecha: { type: Date, default: Date.now, required: false },
});

/* pricesSchema.pre("save", function (next) {
  if (this.Historial.length > 1) {
    for (let i = 1; i < this.Historial.length; i++) {
      const prev = this.Historial[i - 1];
      const curr = this.Historial[i];
      curr.Porcentaje = ((curr.Valor - prev.Valor) / prev.Valor) * 100;
    }
  }
  next();
}); */

module.exports.esquema = model("Precios", quotationsSchema);
module.exports.clase = quotationsSchema;
