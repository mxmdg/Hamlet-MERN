const prices = require("../../models/prices");

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
    price.Categoria= Categoria;
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
    const price = await prices.esquema.findByIdAndDelete(req.params.id);
    res.json({ Message: "Formula eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el costo" });
    
  }
  
};

module.exports = pricesControl;
