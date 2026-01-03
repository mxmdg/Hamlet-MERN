const { Schema, model, isValidObjectId } = require("mongoose");
const mongoose = require("../dbConnection");
const timeAgo = require("node-time-ago");

function orientation(x, y) {
  const formato = `${x} x ${y}`;
  let orientacion;
  console.log(x, y);
  if (x > y) {
    orientacion = "Apaisado";
  } else if (y > x) {
    orientacion = "Vertical";
  } else if (x === y) {
    orientacion = "Cuadrado";
  }
  return { orientacion, formato };
}

const partTypeSchema = new Schema({
  jobTypes: [],
  maxStockWeight: { type: Number, required: false },
  minStockWeight: { type: Number, required: false },
  maxStockWeight: { type: Number, required: false },
  Type: { type: String, required: true },
  pageRange: [],
  printModeAllowed: { type: String, required: false },
});

const jobTypeSchema = new Schema({
  name: { type: String, required: true },
  max: { type: Number, required: true },
  min: { type: Number, required: true },
  pagMax: { type: Number, required: true },
  pagMin: { type: Number, required: true },
  id: { type: String, required: true },
});

const partSchema = new Schema({
  jobParts: { type: [partTypeSchema], required: true },
  //'Type': {type: String, required: true},
  Name: { type: String, required: true },
  Pages: { type: Number, required: true },
  Ancho: { type: Number, required: true },
  Alto: { type: Number, required: true },
  Formato: { type: String },
  Orientacion: { type: String },
  ColoresFrente: { type: Number, required: true },
  ColoresDorso: { type: Number, required: false, default: 0 },
  partStock: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  Finishing: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Finishers",
      required: true,
      default: [],
    },
  ],
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: false,
    index: true,
  },
});

const jobSchema = new Schema({
  Nombre: { type: String, required: true },
  Tipo: { type: [jobTypeSchema], required: true },
  Cantidad: { type: Number, required: true },
  Archivos: { type: String, required: false },
  Entrega: { type: Date, required: true },
  Fecha: { type: Date, default: Date.now },
  Partes: { type: [partSchema], required: true },
  Owner: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
  Company: { type: mongoose.Schema.ObjectId, ref: "Empresas", required: true },
  //Finishing: { type: Object, required: false, default: [] },
  //Finishing: [{ type: mongoose.Schema.ObjectId || Object, ref: "Finishers" }],
  Finishing: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
    default: [],
  },
  status: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo",
  },
});

// Definimos una función que se ejecutará antes de guardar cada parte
partSchema.pre("save", function (next) {
  // Accedemos a Ancho y Alto de la instancia actual (this)
  const { orientacion, formato } = orientation(this.Ancho, this.Alto);
  console.log("Orientacion calculada:", orientacion);
  console.log("Formato calculado:", formato);
  // Definimos el formato a partir de Ancho y Alto
  this.Orientacion = orientacion; // Asignamos la orientación calculada a la propiedad Orientacion;
  this.Formato = formato;
  next();
});

jobSchema.path("Finishing").get(function (finishing) {
  if (!finishing) return [];

  return Array.isArray(finishing)
    ? finishing.map((item) =>
        typeof item === "object" && item._id ? item._id : item
      )
    : typeof finishing === "object" && finishing._id
    ? [finishing._id]
    : [finishing];
});

jobSchema.virtual("Emision").get(function () {
  return timeAgo(this.Fecha);
});

jobSchema.virtual("DeadLine").get(function () {
  return timeAgo(this.Entrega);
});

jobSchema.set("toJSON", { virtuals: true });

module.exports.esquema = model("Job", jobSchema);
module.exports.clase = jobSchema;
