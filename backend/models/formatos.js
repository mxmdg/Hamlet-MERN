const { Schema, model } = require('mongoose');

const formatoSchema = new Schema(
    { 
        'Nombre': {type: String, default: (this.Ancho + " x " + this.Alto),required: true},
        'Ancho': {type: Number, required: true},
        'Alto': {type: Number, required: true},
    },
    {
        virtuals: {
            Superficie: {
                get() {
                    return (this.Ancho * this.Alto)
                }
            }
        }
    }, {
        toJSON: { virtuals: true } // <-- include virtuals in `JSON.stringify()`
      }
    );

module.exports.esquema = model('Formatos', formatoSchema);
module.exports.clase = formatoSchema;