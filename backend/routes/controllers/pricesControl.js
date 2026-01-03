const prices = require("../../models/prices");

//Modelos de las categorias, para verificar que los costos no esten asociados a procesos de terminación
const Finishers = require("../../models/finishers");
const printers = require("../../models/printers");
const materiales = require("../../models/materiales");

const pricesControl = {};

pricesControl.getPrices = async (req, res, next) => {
  try {
    const gettedPrices = await prices.esquema.find({
      status: { $ne: "inactivo" },
    });
    res.json(gettedPrices);
  } catch (error) {
    next(error);
  }
};

pricesControl.getDeletedPrices = async (req, res, next) => {
  try {
    const gettedPrices = await prices.esquema.find({
      status: { $eq: "inactivo" },
    });
    res.json(gettedPrices);
  } catch (error) {
    next(error);
  }
};

pricesControl.addPrice = async (req, res) => {
  {
    try {
      const { Categoria, Proceso, Valor, Minimo, Entrada } = req.body;
      const Historial = [];
      const newPrice = new prices.esquema({
        Categoria,
        Proceso,
        Valor,
        Minimo,
        Entrada,
        Historial,
      });
      await newPrice.save();
      res.json({ message: newPrice.Proceso + " ha sido agregado" });
    } catch (e) {
      console.log(e);
    }
  }
};

pricesControl.getPrice = async (req, res) => {
  try {
    const price = await prices.esquema.findById(req.params.id);
    if (price) {
      res.json(price);
    } else {
      res.status(404).json({ message: "Formula no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la formula" });
  }
};

//Update Price por GPT

pricesControl.updatePrice = async (req, res) => {
  try {
    const { Categoria, Proceso, Valor, Minimo, Entrada, Historial } = req.body;
    const Fecha = Date.now();
    const currentPrice = [Categoria, Proceso, Valor, Minimo, Entrada, Fecha];

    const price = await prices.esquema.findById(req.params.id);

    if (!price) {
      return res.status(404).json({ message: "Formula no encontrada" });
    }

    const historialItem = {
      Valor: price.Valor,
      Minimo: price.Minimo,
      Entrada: price.Entrada,
      Fecha: price.Fecha,
    };
    const historialCurrent = {
      Valor: Valor,
      Minimo: Minimo,
      Entrada: Entrada,
      Fecha: Fecha,
    };
    price.Historial.splice(
      price.Historial.length - 1,
      1,
      historialItem,
      historialCurrent
    );
    price.Categoria = Categoria;
    price.Valor = Valor;
    price.Minimo = Minimo;
    price.Entrada = Entrada;
    price.Fecha = Fecha;
    price.Proceso = Proceso;

    await price.save();

    res.json({ message: "Formula actualizada", price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la Formula" });
  }
};

pricesControl.deletePrice = async (req, res, next) => {
  try {
    const priceId = req.params.id;

    // Verificar si el precio está en uso en algún proceso
    const finishersConEsteCosto = await Finishers.esquema.countDocuments({
      Costo: priceId,
    });
    const printersConEsteCosto = await printers.esquema.countDocuments({
      Costo: priceId,
    });
    const materialesConEsteCosto = await materiales.esquema.countDocuments({
      Precio_x_Kilo: priceId,
    });

    const procesosConEsteCosto =
      finishersConEsteCosto + printersConEsteCosto + materialesConEsteCosto;

    if (procesosConEsteCosto > 0) {
      return res.status(400).json({
        message: `No se puede desactivar este costo porque está siendo utilizado en otros ${procesosConEsteCosto} procesos.`,
      });
    }

    // Si no está en uso, marcar como inactivo
    const price = await prices.esquema.findByIdAndUpdate(
      priceId,
      { status: "inactivo" },
      { new: true }
    );

    if (!price) {
      return res.status(404).json({ message: "Costo no encontrado" });
    }

    res.json({ message: "Costo desactivado correctamente", price });
  } catch (error) {
    next(error);
  }
};

pricesControl.updateStatus = async (req, res, next) => {
  try {
    const p = await prices.esquema.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Costo no encontrado" });
    p.status = p.status === "activo" ? "inactivo" : "activo";
    await p.save();
    res.json({ message: "Estado actualizado", price: p });
  } catch (error) {
    next(error);
  }
};

module.exports = pricesControl;
