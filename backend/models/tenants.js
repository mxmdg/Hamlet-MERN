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
    settings: {
      pricing: {
        gain: {
          min: { type: Number, default: 20 },
          def: { type: Number, default: 40 },
          max: { type: Number, default: 60 },
        },
        commission: {
          min: { type: Number, default: 0 },
          def: { type: Number, default: 0 },
          max: { type: Number, default: 20 },
        },
      },

      mail: {
        from: { type: String },
        host: { type: String },
        port: { type: Number },
        secure: { type: Boolean, default: true },
        user: { type: String },
        pass: { type: String },
      },

      locale: {
        currency: { type: String, default: "ARS" },
        language: { type: String, default: "es" },
      },
    },
  },
  { timestamps: true },
);

TenantSchema.index({ key: 1 }, { unique: true });

module.exports.esquema = mongoose.model("Tenant", TenantSchema);
module.exports.clase = TenantSchema;
