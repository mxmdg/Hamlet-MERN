const { Schema, model, default: mongoose } = require("mongoose");

const formatoSchema = new Schema({
  Nombre: {
    type: String,
    default: this.Ancho + " x " + this.Alto,
    required: false,
  },
  Ancho: { type: Number, required: true },
  Alto: { type: Number, required: true },
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

formatoSchema.virtual("Superficie").get(function () {
  return this.Alto * this.Ancho + " mm2";
});

formatoSchema.set("toJSON", { virtuals: true });
module.exports.esquema = model("Formatos", formatoSchema);
module.exports.clase = formatoSchema;
