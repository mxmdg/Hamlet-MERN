const { Schema, model } = require('mongoose');

const jobPartSchema = new Schema(
    { 
      'Type': {type: String, required: true},
        'minPages': {type: Number, required: true},
        'maxPages': {type: Number, required: true},
        'PrintModAllowed': {
            type: String,
            enum: ['simplex', 'duplex'],
            required: function() {
              return this.bacon > 3;
            }
          },
        'minStockWeight': {type: Number, required: true},
        'maxStockWeight': {type: Number, required: true},
        'Fecha': {type: Date, default: Date.now},
    });

module.exports.esquema = model('JobPart', jobPartSchema);
module.exports.clase = jobPartSchema;