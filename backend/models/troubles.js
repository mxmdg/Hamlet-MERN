const { Schema, model, default: mongoose } = require("mongoose");

const troubleSchema = new Schema({
  sourceType: {
    type: String,
    enum: ["printers", "materiales", "jobs"],
    required: true,
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "sourceType",
  },
  code: { type: String, required: true },
  description: { type: String, required: true },
  solution: { type: String, required: false },
  date: { type: Date, default: Date.now, required: false },
  status: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo",
  },
  severity: {
    type: String,
    enum: ["bajo", "medio", "alto"],
    default: "medio",
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true,
  },
});
module.exports.esquema = model("Trouble", troubleSchema);
module.exports.clase = troubleSchema;
