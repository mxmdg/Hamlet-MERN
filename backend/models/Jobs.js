const { Schema, model, isValidObjectId } = require('mongoose');
const mongoose = require('../dbConnection')
const timeAgo = require('node-time-ago');

const partTypeSchema = new Schema(
    {
        'jobTypes': [],
        'maxStockWeight': {type: Number, required: false},
        'minStockWeight': {type: Number, required: false},
        'maxStockWeight': {type: Number, required: false},
        'type': {type: String, required: true},
        'pageRange': [],
        'printModeAllowed': {type: String, required: false}
    }
)

const jobTypeSchema = new Schema(
    {
        'name': {type: String, required: true},
        'max': {type: Number, required: true},
        'min': {type: Number, required: true},
        'pagMax': {type: Number, required: true},
        'pagMin': {type: Number, required: true},
        'id': {type: String, required: true},
      }
)

const partSchema = new Schema(
    {
        'jobParts': [partTypeSchema],
        //'Type': {type: String, required: true},
        'Pages': {type: Number, required: true},
        'Ancho': {type: Number, required: true},
        'Alto': {type: Number, required: true},
        'ColoresFrente': {type: Number, required: true},
        'ColoresDorso': {type: Number, required: true},
        'partStock': { type: mongoose.Schema.ObjectId, ref: "Category"}
    }

)

const jobSchema = new Schema(
    { 
        'Nombre': {type: String, required: true},
        'Tipo': [jobTypeSchema],
        'Cantidad': {type: Number, required: true},
        'Archivos': {type: String, required: false},
        'Entrega': {type: Date, required: true},
        'Fecha': {type: Date, default: Date.now},
        'Partes': [partSchema],
        'Owner':{ type: mongoose.Schema.ObjectId, ref: "Users"},
    });

jobSchema.virtual('Emision')
.get(function () { return (timeAgo(this.Fecha))})

jobSchema.virtual('DeadLine')
.get(function () { return (timeAgo(this.Entrega))})


jobSchema.set('toJSON', {virtuals: true})

module.exports.esquema = model('Job', jobSchema);
module.exports.clase = jobSchema;