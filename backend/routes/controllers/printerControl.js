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
      TotalPrints,
      ColorPrints,
      BlackPrints,
      LargePrints,
      SmallPrints,
    } = req.body;

    const Billing = [];

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
      TotalPrints,
      ColorPrints,
      BlackPrints,
      LargePrints,
      SmallPrints,
      Billing,
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
      TotalPrints,
      ColorPrints,
      BlackPrints,
      LargePrints,
      SmallPrints,
      Billing,
    } = req.body;
    const printer = await printers.esquema.findById(req.params.id);

    if (!printer) {
      return res.status(404).json({ message: "Impresora no encontrada" });
    }

    const currentBilling = {
      TotalPrints: printer.TotalPrints,
      ColorPrints: printer.ColorPrints,
      BlackPrints: printer.BlackPrints,
      LargePrints: printer.LargePrints,
      SmallPrints: printer.SmallPrints,
    };

    const newBilling = {
      TotalPrints,
      ColorPrints,
      BlackPrints,
      LargePrints,
      SmallPrints,
    };

    printer.Billing.splice(
      printer.Billing.length - 1,
      1,
      currentBilling,
      newBilling
    );
    printer.Modelo = Modelo;
    printer.SerialNumber = SerialNumber;
    printer.Fabricante = Fabricante;
    printer.Colores = Colores;
    printer.X_Minimo = X_Minimo;
    printer.X_Maximo = X_Maximo;
    printer.Y_Minimo = Y_Minimo;
    printer.Y_Maximo = Y_Maximo;
    printer.Paginas_por_minuto = Paginas_por_minuto;
    printer.Costo = Costo;
    (printer.TotalPrints = TotalPrints),
      (printer.ColorPrints = ColorPrints),
      (printer.BlackPrints = BlackPrints),
      (printer.LargePrints = LargePrints),
      (printer.SmallPrints = SmallPrints),
      await printer.save();
    res.json({ message: "Impresora actualizada " + printer.Modelo });
  } catch (e) {
    console.log(e);
    res.json({ message: "Error: " + e });
  }
};

printerControl.deletePrinter = async (req, res) => {
  try {
    const impresora = await printers.esquema.findByIdAndDelete(req.params.id);
   res.json({
    message: `${impresora.Fabricante} ${impresora.Modelo} eliminada`,
  });
  } catch (error) {
    console.log(e);
    res.json({ message: "Error: " + e });
  }
  
};

module.exports = printerControl;
