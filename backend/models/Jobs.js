const { Schema, model, isValidObjectId } = require('mongoose');
const mongoose = require('../dbConnection')

const partTypeSchema = new Schema(
    {
        'jobTypes': [],
        'maxStockWeight': {type: Number, required: false},
        'minStockWeight': {type: Number, required: false},
        'maxStockWeight': {type: Number, required: false},
        'pageRange': [],
        'printModeAllowed': {type: String, required: false}
    }
)

const partSchema = new Schema(
    {
        'jobParts': { any: Object },
        'Pages': {type: Number, required: false},
        'Ancho': {type: Number, required: false},
        'Alto': {type: Number, required: false},
        'ColoresFrente': {type: Number, required: false},
        'ColoresDorso': {type: Number, required: false},
        'partStock': { type: mongoose.Schema.ObjectId, ref: "Category"}
    }

)

const jobSchema = new Schema(
    { 
        'Nombre': {type: String, required: false},
        'Tipo': {type: String, required: false},
        'Cantidad': {type: Number, required: false},
        'Archivos': {type: String, required: false},
        'Fecha': {type: Date, default: Date.now},
        'Partes': [partSchema]
    });

module.exports.esquema = model('Job', jobSchema);
module.exports.clase = jobSchema;