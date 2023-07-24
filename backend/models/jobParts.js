const { Schema, model } = require('mongoose');

const jobPartSchema = new Schema(
    { 
        'Type': {type: String, required: true},
        'PageRange': {type: Array, required: true},
        'PrintModAllowed': {type: Array, required: true},
        'StockWeightRange': {type: Array, required: false},
        'Fecha': {type: Date, default: Date.now},
        
    });

module.exports.esquema = model('JobPart', jobPartSchema);
module.exports.clase = jobPartSchema;