const { Schema, model, default: mongoose } = require("mongoose");

const empresaSchema = new Schema({
  Nombre: {
    type: String,
    required: [true, "Ingrese el nombre de la empresa"],
    unique: [true, "Esta empresa ya existe (model.unique)"],
  },
  email: {
    type: String,
    required: [false],
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ || "0",
  },
  Calle: {
    type: String,
    required: [false],
  },
  Ciudad: { type: String, required: false },
  Codigo_Postal: { type: String, required: false },
  Provincia: { type: String, required: false },
  Pais: { type: String, default: "Argentina", required: false },
  Telefono: { type: String, required: false },
  status: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo",
  },
  tenantId: {
    type: mongoose.Schema.ObjectId,
    ref: "Tenant",
    required: false,
    index: true,
  },
});

empresaSchema.set("toJSON");
module.exports.esquema = model("empresas", empresaSchema);
module.exports.clase = empresaSchema;
