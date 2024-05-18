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
});

module.exports.esquema = model("Material", materialSchema);
module.exports.claseMaterial = materialSchema;
