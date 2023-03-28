const printers = require('../../models/printers')

const printerControl= {}

printerControl.getPrinters = async (req,res) => {{
    const printer = await printers.esquema.find()
    res.json(printer);
}}

printerControl.addPrinter = async (req,res)=>{{
    const {Nombre, Fabricante, Colores, X_Minimo, X_Maximo, Y_Minimo, Y_Maximo, Paginas_por_minuto, Costo_impresion} = req.body;
    const newPrinter = new printers.esquema({Nombre, Fabricante, Colores, X_Minimo, X_Maximo, Y_Minimo, Y_Maximo, Paginas_por_minuto, Costo_impresion});
    await newPrinter.save();
    res.json({"message": newPrinter.Nombre + " guardado OK"});
    
}}

printerControl.getPrinter = async (req, res)=> {
    console.log(req.params.id)
    res.json({"Message": "Impresora encontrada " + req.params.id})
}
printerControl.updatePrinter = async (req, res)=> {
    const {Nombre, Fabricante, Colores, X_Minimo, X_Maximo, Y_Minimo, Y_Maximo, Paginas_por_minuto, Costo_impresion} = req.body;
    const printer = await printers.esquema.findOneAndUpdate({Nombre, Fabricante, Colores, X_Minimo, X_Maximo, Y_Minimo, Y_Maximo, Paginas_por_minuto, Costo_impresion})
    res.json({"Message": "Impresora actualizada " + printer.Nombre})
}
printerControl.deletePrinter = async (req, res)=> {
    const impresora =  await printers.esquema.findByIdAndDelete(req.params.id);
    res.json({"Message": "Impresora eliminada"});
}

  module.exports = printerControl