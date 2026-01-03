const mongoose = require("mongoose");

const TenantSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, // ej: "imprenta-dorrego"
    },
    name: {
      type: String,
      required: true, // "Imprenta Dorrego"
      trim: true,
    },
    status: {
      type: String,
      enum: ["activo", "pendiente", "inactivo"],
      default: "activo",
    },
    plan: {
      type: String,
      enum: ["trial", "basic", "pro"],
      default: "trial",
    },
  },
  { timestamps: true }
);

TenantSchema.index({ key: 1 }, { unique: true });

module.exports.esquema = mongoose.model("Tenant", TenantSchema);
module.exports.clase = TenantSchema;
