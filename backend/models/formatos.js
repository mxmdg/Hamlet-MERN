const { Schema, model } = require('mongoose');

const formatoSchema = new Schema(
    { 
        'Nombre': {type: String, default: (this.Ancho + " x " + this.Alto),required: false},
        'Ancho': {type: Number, required: true},
        'Alto': {type: Number, required: true},
    }
    );

formatoSchema.virtual('Superficie')
    .get(function () { return ((this.Alto * this.Ancho) + ' mm2')})


formatoSchema.set('toJSON', {virtuals: true})
module.exports.esquema = model('Formatos', formatoSchema);
module.exports.clase = formatoSchema;