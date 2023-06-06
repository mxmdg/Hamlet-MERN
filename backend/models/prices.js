const { Schema, model } = require('mongoose');

const pricesSchema = new Schema(
    { 
        'Proceso': {type: String, required: true},
        'Valor': {type: Number, required: true},
        'Minimo': {type: Number, required: true},
        'Entrada': {type: Number, required: false},
<<<<<<< HEAD
        'Historial': [
            {
              Valor: { type: Number, required: true },
              Minimo: { type: Number, required: true },
              Entrada: { type: Number, required: false },
              Fecha: { type: Date, default: Date.now, required: true }
            }
          ],
=======
        //'Formula': {type: String, required: false},
>>>>>>> parent of 29a442c (0.0.942)
        'Fecha': {type: Date, default: Date.now, required: false}
    });

module.exports.esquema = model('Precios', pricesSchema);
module.exports.clase = pricesSchema;