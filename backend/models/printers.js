const { Schema, model, default: mongoose } = require('mongoose');
const { leanFormats } = require('../routes/controllers/formatControl')
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

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

printerSchema.set('toObject', {virtuals: true, getters: true})
printerSchema.set('toJSON', {virtuals: false, getters: true})   
printerSchema.plugin(mongooseLeanVirtuals);

printerSchema.virtual("admitedFormats")
    .get(async function filterFormats() {
        const xMax = this.X_Maximo;
        const xMin = this.X_Minimo;
        const yMax = this.Y_Maximo;
        const yMin = this.Y_Minimo;
        const admitedFormats = [];
        try {
            const allFormats = await leanFormats();
                        
            for (const format of allFormats) {
                if (Math.max(format.Alto, format.Ancho) <= xMax &&
                    Math.min(format.Alto, format.Ancho) >= xMin &&
                    Math.min(format.Alto, format.Ancho) <= yMax &&
                    Math.max(format.Alto, format.Ancho) >= yMin) {
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

     

    console.log("printerSchema.virtuals")
    console.log(printerSchema.virtuals)

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
