const { Schema, model, default: mongoose } = require("mongoose");

// Nuevo esquema para el contador de presupuestos
const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = model("Counter", counterSchema);

const quotationsSchema = new Schema({
  index: { type: Number, unique: true }, // Número de presupuesto consecutivo
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
  status: { type: String, required: false, default: "Pendiente", enum: ["Pendiente", "Enviado", "Aprobado", "Rechazado"] },
  customerId: {
    type: mongoose.Schema.ObjectId,
    ref: "customers",
    required: false,
  },
  jobType: { type: String, required: false },
});

// Middleware para autoincrementar el campo index antes de guardar
quotationsSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "quotations" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.index = counter.seq
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports.esquema = model("Quotations", quotationsSchema);
module.exports.clase = quotationsSchema;
