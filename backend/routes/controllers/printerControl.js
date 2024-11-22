const printers = require("../../models/printers");
const prices = require("../../models/prices");

const printerControl = {};

printerControl.getPrinters = async (req, res, next) => {
  {
    const printer = await printers.esquema
      .find()
      .populate({ path: "Costo", model: prices.esquema });
    res.json(printer);
  }
};

printerControl.addPrinter = async (req, res, next) => {
  {
    const {
      Modelo,
      SerialNumber,
      Fabricante,
      Colores,
      X_Minimo,
      X_Maximo,
      Y_Minimo,
      Y_Maximo,
      Paginas_por_minuto,
      Costo,
    } = req.body;
    const newPrinter = new printers.esquema({
      Modelo,
      SerialNumber,
      Fabricante,
      Colores,
      X_Minimo,
      X_Maximo,
      Y_Minimo,
      Y_Maximo,
      Paginas_por_minuto,
      Costo,
    });
    try {
      await newPrinter.save();
      res.json({ message: newPrinter.Modelo + " guardado OK" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};

printerControl.getPrinter = async (req, res, next) => {
  try {
    const printer = await printers.esquema.findById(req.params.id);
    if (printer) {
      res.json(printer);
    } else {
      res.status(404).json({ message: "Impresora no encontrada" });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Error al obtener la impresora" });
  }
};

printerControl.updatePrinter = async (req, res) => {
  try {
    const {
      Modelo,
      SerialNumber,
      Fabricante,
      Colores,
      X_Minimo,
      X_Maximo,
      Y_Minimo,
      Y_Maximo,
      Paginas_por_minuto,
      Costo,
    } = req.body;
    const printer = await printers.esquema.findOneAndUpdate(
      { _id: req.params.id },
      {
        Modelo,
        SerialNumber,
        Fabricante,
        Colores,
        X_Minimo,
        X_Maximo,
        Y_Minimo,
        Y_Maximo,
        Paginas_por_minuto,
        Costo,
      }
    );
    res.json({ message: "Impresora actualizada " + printer.Modelo });
  } catch (e) {
    console.log(e);
    res.json({ message: "Error: " + e });
  }
};
printerControl.deletePrinter = async (req, res) => {
  const impresora = await printers.esquema.findByIdAndDelete(req.params.id);
  res.json({
    message: `${impresora.Fabricante} ${impresora.Modelo} eliminada`,
  });
};

module.exports = printerControl;
