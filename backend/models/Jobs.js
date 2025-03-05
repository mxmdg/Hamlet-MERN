const { Schema, model, isValidObjectId } = require("mongoose");
const mongoose = require("../dbConnection");
const timeAgo = require("node-time-ago");

function orientation(x, y) {
  let orientacion;
  console.log(x, y);
  if (x > y) {
    orientacion = "Apaisado";
  } else if (y > x) {
    orientacion = "Vertical";
  } else if (x === y) {
    orientacion = "Cuadrado";
  }
  return orientacion;
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
  jobParts: [partTypeSchema],
  //'Type': {type: String, required: true},
  Name: { type: String, required: true },
  Pages: { type: Number, required: true },
  Ancho: { type: Number, required: true },
  Alto: { type: Number, required: true },
  Orientacion: { type: String },
  ColoresFrente: { type: Number, required: true },
  ColoresDorso: { type: Number, required: false, default: 0 },
  partStock: { type: mongoose.Schema.ObjectId, ref: "Category" },
  Finishing: [{ type: mongoose.Schema.ObjectId, ref: "Finishers" }],
});

const jobSchema = new Schema({
  Nombre: { type: String, required: true },
  Tipo: [jobTypeSchema],
  Cantidad: { type: Number, required: true },
  Archivos: { type: String, required: false },
  Entrega: { type: Date, required: true },
  Fecha: { type: Date, default: Date.now },
  Partes: [partSchema],
  Owner: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
  Company: { type: mongoose.Schema.ObjectId, ref: "Empresas", required: true },
  Finishing: [{ type: mongoose.Schema.ObjectId, ref: "Finishers" }],
});

// Definimos una función que se ejecutará antes de guardar cada parte
partSchema.pre("save", function (next) {
  // Accedemos a Ancho y Alto de la instancia actual (this)
  const orientacion = orientation(this.Ancho, this.Alto);
  console.log("PreSave: " + this.Ancho + " " + this.Alto);
  this.Orientacion = orientacion; // Asignamos la orientación calculada a la propiedad Orientacion
  next();
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
