const { Schema, model, default: mongoose } = require("mongoose");

const jobPartSchema = new Schema({
  Type: { type: String, required: true },
  minWidth: { type: Number, required: true },
  maxWidth: { type: Number, required: true },
  minHeight: { type: Number, required: true },
  maxHeight: { type: Number, required: true },
  minPages: { type: Number, required: true },
  maxPages: { type: Number, required: true },
  PrintModAllowed: {
    type: String,
    enum: ["simplex", "duplex", "Simplex", "Duplex"],
    required: function () {
      return this.bacon > 3;
    },
  },
  minStockWeight: { type: Number, required: true },
  maxStockWeight: { type: Number, required: true },
  jobTypesAllowed: { type: Object, required: true },
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
  Fecha: { type: Date, default: Date.now },
});

module.exports.esquema = model("JobPart", jobPartSchema);
module.exports.clase = jobPartSchema;
