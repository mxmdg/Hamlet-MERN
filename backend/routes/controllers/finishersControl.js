const finishers = require("../../models/finishers");
const prices = require("../../models/prices");

const finishersControl = {};

finishersControl.getFinishers = async (req, res, next) => {
  {
    try {
      const finishersList = await finishers.esquema
        .find({ status: { $ne: "inactivo" } })
        .populate({
          path: "Costo",
          model: prices.esquema,
        });
      res.json(finishersList);
      return finishersList;
    } catch (error) {
      console.log(error);
      next(error);
      res
        .status(500)
        .json({ message: error.message || "Error al obtener los acabados" });
    }
  }
};

finishersControl.getDeletedFinishers = async (req, res, next) => {
  {
    try {
      const finishersList = await finishers.esquema
        .find({ status: { $eq: "inactivo" } })
        .populate({
          path: "Costo",
          model: prices.esquema,
        });
      res.json(finishersList);
      return finishersList;
    } catch (error) {
      console.log(error);
      next(error);
      res
        .status(500)
        .json({ message: error.message || "Error al obtener los acabados" });
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
      jobTypesAllowed,
      partTypesAllowed,
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
      jobTypesAllowed,
      partTypesAllowed,
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
    const finisher = await finishers.esquema
      .findById(req.params.id)
      .populate({ path: "Costo", model: prices.esquema })
      .select("-Costo.Historial");
    if (finisher) {
      res.json(finisher);
    } else {
      res.status(404).json({ message: "Maquinaria no encontrada" });
    }
  } catch (error) {
    console.log(error);
    next(error);
    res
      .status(500)
      .json({ message: error.message || "Error al obtener la Maquinaria" });
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
      jobTypesAllowed,
      partTypesAllowed,
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
        jobTypesAllowed,
        partTypesAllowed,
      }
    );
    res.json({ message: "Impresora actualizada " + finisherToUpdate.Modelo });
  } catch (e) {
    //res.json({ message: "Error: " + e });
    next(e);
  }
};
finishersControl.deleteFinisher = async (req, res, next) => {
  try {
    const finisher = await finishers.esquema.findByIdAndUpdate(
      req.params.id,
      { status: "inactivo" },
      { new: true, runValidators: true }
    );

    if (!finisher) {
      return res.status(404).json({ message: "Acabado no encontrado" });
    }

    res.json({
      message: `${finisher.Fabricante} ${finisher.Modelo} desactivado`,
      finisher,
    });
  } catch (error) {
    next(error);
  }
};

finishersControl.updateStatus = async (req, res, next) => {
  try {
    const finisher = await finishers.esquema.findById(req.params.id);
    if (!finisher) {
      return res.status(404).json({ message: "Acabado no encontrado" });
    }
    finisher.status = finisher.status === "activo" ? "inactivo" : "activo";
    await finisher.save();
    res.json({
      message: `Acabado ${finisher.Fabricante} ${finisher.Modelo} actualizado`,
      finisher,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = finishersControl;
