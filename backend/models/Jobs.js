const { Schema, model } = require('mongoose');

const jobSchema = new Schema(
    { 
        'Nombre': {type: String, required: true},
        'Tipo': {type: String, required: true},
        'Cantidad': {type: Number, required: true},
        'Archivos': {type: String, required: false},
        'Fecha': {type: Date, default: Date.now},
        
    });

module.exports.esquema = model('Job', jobSchema);
module.exports.clase = jobSchema;