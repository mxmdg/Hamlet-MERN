const printers = require("../../models/printers");
const prices = require("../../models/prices");

const printerControl = {};

printerControl.getPrinters = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const printer = await printers.esquema
      .find({ tenant, status: { $ne: "inactivo" } })
      .select("-__v")
      .populate({ path: "Costo", model: prices.esquema });
    res.json(printer);
  } catch (error) {
    next(error);
  }
};

printerControl.getDeletedPrinters = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const printer = await printers.esquema
      .find({ tenant, status: { $eq: "inactivo" } })
      .select("-__v")
      .populate({ path: "Costo", model: prices.esquema });
    res.json(printer);
  } catch (error) {
    next(error);
  }
};

printerControl.addPrinter = async (req, res, next) => {
  {
    const {
      Modelo,
      SerialNumber,
      Fabricante,
      Tipo,
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
    const tenant = req.header("x-tenant");

    const newPrinter = new printers.esquema({
      Modelo,
      SerialNumber,
      Fabricante,
      Tipo,
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
      tenant,
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
    const tenant = req.header("x-tenant");
    const printer = await printers.esquema.findOne({
      _id: req.params.id,
      tenant,
    });
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

printerControl.getPrinterSimple = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const printer = await printers.esquema
      .findOne({ _id: req.params.id, tenant })
      .select(
        "-Billing -Costo.Historial -Costo.Formula -TotalPrints -ColorPrints -BlackPrints -LargePrints -SmallPrints",
      );
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

printerControl.getPrintersSimple = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const printer = await printers.esquema
      .find({ tenant, status: { $ne: "inactivo" } })
      .select(
        "-Billing -TotalPrints -ColorPrints -BlackPrints -LargePrints -SmallPrints",
      )
      .populate({
        path: "Costo",
        model: prices.esquema,
        select: "-Historial -Formula",
      });
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
      Tipo,
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
    const tenant = req.header("x-tenant");
    const printer = await printers.esquema.findOne({
      _id: req.params.id,
      tenant,
    });

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

    printer.Billing = printer.Billing || [];
    printer.Billing.splice(
      Math.max(0, printer.Billing.length - 1),
      1,
      currentBilling,
      newBilling,
    );

    printer.Modelo = Modelo;
    printer.SerialNumber = SerialNumber;
    printer.Fabricante = Fabricante;
    printer.Tipo = Tipo;
    printer.Colores = Colores;
    printer.X_Minimo = X_Minimo;
    printer.X_Maximo = X_Maximo;
    printer.Y_Minimo = Y_Minimo;
    printer.Y_Maximo = Y_Maximo;
    printer.Paginas_por_minuto = Paginas_por_minuto;
    printer.Costo = Costo;
    printer.TotalPrints = TotalPrints;
    printer.ColorPrints = ColorPrints;
    printer.BlackPrints = BlackPrints;
    printer.LargePrints = LargePrints;
    printer.SmallPrints = SmallPrints;

    await printer.save();
    res.json({ message: "Impresora actualizada " + printer.Modelo });
  } catch (e) {
    console.log(e);
    res.json({ message: "Error: " + e });
  }
};

printerControl.deletePrinter = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const impresora = await printers.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
      { status: "inactivo" },
      { new: true },
    );
    if (!impresora)
      return res.status(404).json({ message: "Impresora no encontrada" });
    res.json({
      message: `${impresora.Fabricante} ${impresora.Modelo} desactivada`,
      impresora,
    });
  } catch (error) {
    next(error);
  }
};

printerControl.updateStatus = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const p = await printers.esquema.findOne({ _id: req.params.id, tenant });
    if (!p) return res.status(404).json({ message: "Impresora no encontrada" });
    p.status = p.status === "activo" ? "inactivo" : "activo";
    await p.save();
    res.json({ message: "Estado actualizado", printer: p });
  } catch (error) {
    next(error);
  }
};

module.exports = printerControl;
