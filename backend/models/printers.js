const { Schema, model, default: mongoose } = require('mongoose');
const { getFormats } = require('../routes/controllers/formatControl')

const printerSchema = new Schema(
    { 
        'Modelo': {type: String, required: true},
        'Fabricante': {type: String, required: false},
        'Colores': {type: Number, required: true},
        'X_Minimo': {type: Number, required: true},
        'X_Maximo': {type: Number, required: true},
        'Y_Minimo': {type: Number, required: true},
        'Y_Maximo': {type: Number, required: true},
        'Paginas_por_minuto': {type: Number, required: true},
        'Costo_impresion': {type: Number, required: true},
        'Fecha': {type: Date, default: Date.now, required: false}
        
    });

//const formatos = await formatos.find()    

printerSchema.virtual("AdmitedFormats")
    .get(async function() {
        const xMax = this.MaxFormatLength;
        const xMin = this.MinFormatLength;
        const yMax = this.MaxFormatWidth;
        const yMin = this.MinFormatWidth;
        const admitedFormats = [];
        try {
            const allFormats = await getFormats();
            
            for (const format of allFormats) {
                if (Math.max(format.Length, format.Width) <= xMax &&
                    Math.min(format.Length, format.Width) >= xMin &&
                    Math.min(format.Length, format.Width) <= yMax &&
                    Math.max(format.Length, format.Width) >= yMin) {
                    admitedFormats.push(format._id);
                }
            }
        } catch (e) {
            console.log(e);
            return [];
        } 
        console.log("Formatos admitidos: ", admitedFormats);
        return admitedFormats;
    }); 

    printerSchema.set('toObject', {virtuals: true, getters: true})
    printerSchema.set('toJSON', {virtuals: false, getters: true})    

module.exports.esquema = model('Printers', printerSchema);
module.exports.clase = printerSchema;
//module.exports = printerSchema;

/* class impresora {
	constructor (Nombre,Colores,xMinimo,xMaximo,yMinimo,yMaximo,PPM,ValorCopia) {
		this.nombre = Nombre;
		this.colores = Colores;
		this.xMin = xMinimo;
		this.xMax = xMaximo;
		this.yMin = yMinimo;
		this.yMax = yMaximo;
		this.ppm = PPM;
		this.valorCopia = ValorCopia;
		this.formatos = formatos.filter(f => Math.max(f.x,f.y) <= this.xMax && Math.min(f.x,f.y) >= this.xMin && Math.min(f.x,f.y) <= this.yMax && Math.max(f.x,f.y) >= this.yMin);
	}


}; */
