const { Schema, model, default: mongoose } = require("mongoose");

const materialSchema = new Schema({
  Nombre_Material: { type: String, required: true },
  Marca: { type: String, required: true },
  Gramaje: { type: Number, required: true },
  Tipo: { type: String, required: true },
  Ancho_Resma: { type: Number, required: true },
  Alto_Resma: { type: Number, required: true },
  Espesor_Resma: { type: Number, required: true },
  Fibra: { type: Number, required: true },
  Precio_x_Kilo: {
    type: mongoose.Schema.ObjectId,
    ref: "Precios",
    required: true,
  },
  Color: { type: String, required: false },
  Stock: { type: Number, required: false, default: 0 },
  status: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo",
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: false,
    index: true,
  },
});

materialSchema.index({ Nombre_Material: 1, tenant: 1 }, { unique: true });

module.exports.esquema = model("Material", materialSchema);
module.exports.claseMaterial = materialSchema;
