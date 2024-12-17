const { Schema, model, default: mongoose } = require("mongoose");

const billingSchema = new Schema({
  TotalPrints: { type: Number, required: false },
  ColorPrints: { type: Number, required: false },
  BlackPrints: { type: Number, required: false },
  LargePrints: { type: Number, required: false },
  SmallPrints: { type: Number, required: false },
  Total: { type: Number, required: false },
  Color: { type: Number, required: false },
  Black: { type: Number, required: false },
  Large: { type: Number, required: false },
  Small: { type: Number, required: false },
  Fecha: { type: Date, default: Date.now, required: false },
});

const printerSchema = new Schema({
  Modelo: { type: String, required: true },
  SerialNumber: { type: String, required: true },
  Fabricante: { type: String, required: false },
  Colores: { type: Number, required: true },
  X_Minimo: { type: Number, required: true },
  X_Maximo: { type: Number, required: true },
  Y_Minimo: { type: Number, required: true },
  Y_Maximo: { type: Number, required: true },
  Paginas_por_minuto: { type: Number, required: true },
  Costo: {
    type: mongoose.Schema.ObjectId,
    ref: "Precios",
    required: true,
  },
  TotalPrints: { type: Number, required: false },
  ColorPrints: { type: Number, required: false },
  BlackPrints: { type: Number, required: false },
  LargePrints: { type: Number, required: false },
  SmallPrints: { type: Number, required: false },
  Billing: [billingSchema],
  Fecha: { type: Date, default: Date.now, required: false },
});

printerSchema.pre("save", function (next) {
  if (this.Billing.length > 1) {
    for (let i = 1; i < this.Billing.length; i++) {
      const prev = this.Billing[i - 1];
      const curr = this.Billing[i];
      curr.Total = curr.TotalPrints - prev.TotalPrints;
      curr.Color = curr.ColorPrints - prev.ColorPrints;
      curr.Black = curr.BlackPrints - prev.BlackPrints;
      curr.Large = curr.LargePrints - prev.LargePrints;
      curr.Small = curr.SmallPrints - prev.SmallPrints;
    }
  }
  next();
});

module.exports.esquema = model("Printers", printerSchema);
module.exports.clase = printerSchema;
