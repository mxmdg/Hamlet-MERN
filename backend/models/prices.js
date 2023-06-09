const { Schema, model } = require('mongoose');

const pricesSchema = new Schema(
    { 
        'Proceso': {type: String, required: true},
        'Valor': {type: Number, required: true},
        'Minimo': {type: Number, required: true},
        'Entrada': {type: Number, required: false},
        'Historial': [
            {
              Valor: { type: Number, required: false },
              Minimo: { type: Number, required: false },
              Entrada: { type: Number, required: false },
              Fecha: { type: Date, default: Date.now, required: true }
            }
          ],
        'Fecha': {type: Date, default: Date.now, required: false}
    });

module.exports.esquema = model('Precios', pricesSchema);
module.exports.clase = pricesSchema;