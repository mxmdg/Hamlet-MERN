const { Schema, model, default: mongoose } = require("mongoose");

// Counter schema: one counter per entity+tenant
const counterSchema = new Schema(
  {
    entity: { type: String, required: true },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    seq: { type: Number, default: 0 },
  },
  { timestamps: false }
);

// Unique composite index: one counter per (entity, tenant)
counterSchema.index({ entity: 1, tenant: 1 }, { unique: true });

const Counter = model("Counter", counterSchema);

const quotationsSchema = new Schema({
  index: { type: Number }, // removed unique: true, now unique per tenant via compound index
  quantity: { type: Number, require: true },
  name: { type: String, required: false },
  customer: { type: String, required: false },
  cost: { type: Number, required: false },
  gain: { type: Number, required: false },
  comission: { type: Number, required: false },
  taxes: { type: Number, required: false },
  total: { type: Number, required: false },
  data: { type: Object, required: false },
  fecha: { type: Date, default: Date.now, required: false },
  owner: { type: mongoose.Schema.ObjectId, ref: "usersSchema" },
  jobId: { type: mongoose.Schema.ObjectId, ref: "Jobs", required: false },
  status: {
    type: String,
    required: true,
    default: "Pendiente",
    enum: ["Pendiente", "Enviado", "Aprobado", "Rechazado"],
  },
  customerId: {
    type: mongoose.Schema.ObjectId,
    ref: "customers",
    required: false,
  },
  jobType: { type: String, required: false },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: false, // kept optional at schema level; middleware will enforce presence for index generation
    index: true,
  },
});

// Compound unique index to ensure index is unique per tenant
quotationsSchema.index({ tenant: 1, index: 1 }, { unique: true, sparse: true });

/**
 * pre-save middleware:
 * - Ensures a tenant is present for new documents
 * - Atomically increments the counter for (entity='quotations', tenant)
 * - Assigns the resulting seq to this.index
 */
quotationsSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    // Require tenant to generate tenant-scoped consecutive index
    if (!this.tenant) {
      const err = new Error("Tenant is required to generate quotation index");
      err.status = 400;
      return next(err);
    }

    console.log("Generating tenant-scoped index for tenant:", this.tenant);

    // Atomically increment (or create) the counter for this tenant+entity
    const counter = await Counter.findOneAndUpdate(
      { entity: "quotations", tenant: this.tenant },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();

    console.log("Counter after increment:", counter);

    if (!counter || typeof counter.seq !== "number") {
      return next(new Error("Failed to generate quotation index"));
    }

    // Assign the tenant-scoped consecutive number
    this.index = counter.seq;

    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports.esquema = model("Quotations", quotationsSchema);
module.exports.clase = quotationsSchema;
