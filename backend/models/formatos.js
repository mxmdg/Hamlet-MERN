const { Schema, model } = require('mongoose');

const formatoSchema = new Schema(
    { 
        'Nombre': {type: String, required: true},
        'Ancho': {type: Number, required: true},
        'Alto': {type: Number, required: true},
    });

module.exports.esquema = model('Formatos', formatoSchema);
module.exports.clase = formatoSchema;