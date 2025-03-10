const prices = require("../../models/prices");

//Modelos de las categorias, para verificar que los costos no esten asociados a procesos de terminación
const Finishers = require("../../models/finishers");
const printers = require("../../models/printers");
const materiales = require("../../models/materiales");

const pricesControl = {};

pricesControl.getPrices = async (req, res) => {
  {
    const gettedPrices = await prices.esquema.find();
    res.json(gettedPrices);
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

pricesControl.deletePrice = async (req, res) => {
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

    console.log(
      `No se puede eliminar este costo porque está siendo utilizado en otros ${procesosConEsteCosto} procesos.`
    );

    if (procesosConEsteCosto > 0) {
      return res.status(400).json({
        message: `No se puede eliminar este costo porque está siendo utilizado en otros ${procesosConEsteCosto} procesos.`,
      });
    }

    // Si no está en uso, eliminar el precio
    const price = await prices.esquema.findByIdAndDelete(priceId);

    if (!price) {
      return res.status(404).json({ message: "Costo no encontrado" });
    }

    res.json({ message: "Costo eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

module.exports = pricesControl;
