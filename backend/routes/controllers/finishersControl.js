const finishers = require("../../models/finishers");
const prices = require("../../models/prices");

const finishersControl = {};

finishersControl.getFinishers = async (req, res, next) => {
  {
    try {
      const finishersList = await finishers.esquema.find().populate({
        path: "Costo",
        model: prices.esquema,
      });
      res.json(finishersList);
      return finishersList;
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};

finishersControl.addFinisher = async (req, res, next) => {
  {
    const {
      Modelo,
      Fabricante,
      Proceso,
      X_Minimo,
      X_Maximo,
      Y_Minimo,
      Y_Maximo,
      Velocidad,
      Costo,
      Unidad,
      Descripcion,
    } = req.body;
    const newFinisher = new finishers.esquema({
      Modelo,
      Fabricante,
      Proceso,
      X_Minimo,
      X_Maximo,
      Y_Minimo,
      Y_Maximo,
      Velocidad,
      Costo,
      Unidad,
      Descripcion,
    });
    try {
      await newFinisher.save();
      res.json({ message: newFinisher.Modelo + " guardado OK" });
    } catch (error) {
      next(error);
    }
  }
};

finishersControl.getFinisher = async (req, res, next) => {
  try {
    const finisher = await finishers.esquema.findById(req.params.id);
    //.populate({ path: "Costo", model: prices.esquema });
    if (finisher) {
      res.json(finisher);
    } else {
      res.status(404).json({ message: "Maquinaria no encontrada" });
    }
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).json({ message: "Error al obtener la Maquinaria" });
  }
};

finishersControl.updateFinisher = async (req, res, next) => {
  try {
    const {
      Modelo,
      Fabricante,
      Proceso,
      X_Minimo,
      X_Maximo,
      Y_Minimo,
      Y_Maximo,
      Velocidad,
      Costo,
      Unidad,
      Descripcion,
    } = req.body;
    const finisherToUpdate = await finishers.esquema.findOneAndUpdate(
      { _id: req.params.id },
      {
        Modelo,
        Fabricante,
        Proceso,
        X_Minimo,
        X_Maximo,
        Y_Minimo,
        Y_Maximo,
        Velocidad,
        Costo,
        Unidad,
        Descripcion,
      }
    );
    res.json({ message: "Impresora actualizada " + finisherToUpdate.Modelo });
  } catch (e) {
    //res.json({ message: "Error: " + e });
    next(e);
  }
};
finishersControl.deleteFinisher = async (req, res) => {
  const mahcine = await finishers.esquema.findByIdAndDelete(req.params.id);
  res.json({
    message: `${mahcine.Fabricante} ${mahcine.Modelo} eliminada`,
  });
};

module.exports = finishersControl;
