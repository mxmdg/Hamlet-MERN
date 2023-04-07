const printers = require('../../models/printers')

const printerControl= {}

printerControl.getPrinters = async (req,res) => {{
    const printer = await printers.esquema.find()
    res.json(printer);
}}

printerControl.addPrinter = async (req,res)=>{{
    const {Modelo, Fabricante, Colores, X_Minimo, X_Maximo, Y_Minimo, Y_Maximo, Paginas_por_minuto, Costo_impresion} = req.body;
    const newPrinter = new printers.esquema({Modelo, Fabricante, Colores, X_Minimo, X_Maximo, Y_Minimo, Y_Maximo, Paginas_por_minuto, Costo_impresion});
    try {
        await newPrinter.save();
        res.json({"message": newPrinter.Modelo + " guardado OK"});
    } catch (error) {
        alert(error)
    }
   
    
}}

printerControl.getPrinter = async (req, res)=> {
    try {
        const printer = await printers.esquema.findById(req.params.id);
        if (printer) {
            res.json(printer)
        } else {
            res.status(404).json({ message: "Impresora no encontrada" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener la impresora" });
    }
}

printerControl.updatePrinter = async (req, res)=> {
    try {
        const {Modelo, Fabricante, Colores, X_Minimo, X_Maximo, Y_Minimo, Y_Maximo, Paginas_por_minuto, Costo_impresion} = req.body;
        const printer = await printers.esquema.findOneAndUpdate({ _id: req.params.id },{Modelo, Fabricante, Colores, X_Minimo, X_Maximo, Y_Minimo, Y_Maximo, Paginas_por_minuto, Costo_impresion})
        res.json({"Message": "Impresora actualizada " + printer.Modelo})
    } catch (e) {
        res.json({"Message": "Error: " + e})
    }
    

}
printerControl.deletePrinter = async (req, res)=> {
    const impresora =  await printers.esquema.findByIdAndDelete(req.params.id);
    res.json({"Message": "Impresora eliminada"});
}

  module.exports = printerControl