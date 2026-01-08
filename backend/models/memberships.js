const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "operator", "customer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["activo", "pendiente", "revocado"],
      default: "pendiente",
    },
  },
  { timestamps: false }
);

MembershipSchema.index({ userId: 1, tenant: 1 }, { unique: true });

module.exports = mongoose.model("Membership", MembershipSchema);
