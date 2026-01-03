const { Schema, model, default: mongoose } = require("mongoose");

const materialSchema = new Schema({
  Nombre_Material: { type: String, required: false },
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
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: false,
    index: true,
  },
});

module.exports.esquema = model("Material", materialSchema);
module.exports.claseMaterial = materialSchema;
