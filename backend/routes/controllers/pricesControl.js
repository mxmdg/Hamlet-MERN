const prices = require('../../models/prices')

const pricesControl= {}

pricesControl.getPrices = async (req,res)=>{{
    const gettedPrices = await prices.esquema.find().sort({"Proceso": 1})
    res.json(gettedPrices)}
}

pricesControl.addPrice = async (req,res)=>{{
    try {
        const {Proceso, Valor, Minimo, Entrada} = req.body;
        const Historial = []
        const newPrice = new prices.esquema({Proceso, Valor, Minimo, Entrada, Historial});
        await newPrice.save();
        res.json({"message": newPrice.Proceso + " ha sido agregado"});
    } catch (e) {
        console.log(e)
    }
}}

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
/* formatControl.updateFormat = async (req, res)=> {
    const {Nombre, Alto, Ancho} = req.body;
    const format = await formatos.esquema.findOneAndUpdate({_id: req.params.id}, {Nombre, Alto, Ancho})
    res.json({"Message": "Formato actualizado " + req.params.id})
  } */
/* pricesControl.updatePrice = async (req, res) => {
  try {
    const {Proceso, Valor, Minimo, Entrada , Historial} = req.body;
    const Fecha = Date.now()
    const price = await prices.esquema.findByIdAndUpdate(
      req.params.id,
      { Proceso, Valor, Minimo, Entrada, Fecha , Historial},
      { new: false }
    );
    if (!price) {
      return res.status(404).json({ message: "Formula no encontrada" });
    }
    res.json({ message: "Formula actualizada", price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la Formula" });
  }
}; */

//Update Price por GPT

pricesControl.updatePrice = async (req, res) => {
  try {
    const { Proceso, Valor, Minimo, Entrada, Historial } = req.body;
    const Fecha = Date.now();
    const currentPrice = [Proceso, Valor, Minimo, Entrada, Fecha]

    const price = await prices.esquema.findById(req.params.id);

    if (!price) {
      return res.status(404).json({ message: "Formula no encontrada" });
    }

    const historialItem = {
      Valor: price.Valor,
      Minimo: price.Minimo,
      Entrada: price.Entrada,
      Fecha: price.Fecha
    };
    const historialCurrent = {
      Valor: Valor,
      Minimo: Minimo,
      Entrada: Entrada,
      Fecha: Fecha
    };
    price.Historial.splice(price.Historial.length - 1,1,historialItem,historialCurrent);
    price.Valor = Valor;
    price.Minimo = Minimo;
    price.Entrada = Entrada;
    price.Fecha = Fecha;
    price.Proceso =Proceso;

    await price.save();

    res.json({ message: "Formula actualizada", price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la Formula" });
  }
};


pricesControl.deletePrice = async (req, res)=> {
  const price =  await prices.esquema.findByIdAndDelete(req.params.id);
  res.json({"Message": "Formula eliminado"})
}

module.exports = pricesControl