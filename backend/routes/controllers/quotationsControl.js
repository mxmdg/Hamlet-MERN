const quotations = require("../../models/quotations");
const Jobs = require("../../models/Jobs");

const quotationsControl = {};

// Obtener todas las cotizaciones
quotationsControl.getQuotations = async (req, res) => {
  try {
    const allQuotations = await quotations.esquema
      .find()
      .populate({ path: "jobId", model: Jobs.esquema, select: "Nombre" });
    res.json(allQuotations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las cotizaciones" });
  }
};

// Obtener una cotización por ID
quotationsControl.getQuotation = async (req, res) => {
  try {
    const quotation = await quotations.esquema.findById(req.params.id);
    if (quotation) {
      res.json(quotation);
    } else {
      res.status(404).json({ message: "Cotización no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la cotización" });
  }
};

// Crear una nueva cotización
quotationsControl.addQuotation = async (req, res) => {
  try {
    const newQuotation = new quotations.esquema(req.body);
    await newQuotation.save();
    res.json({ message: "Cotización guardada OK", quotation: newQuotation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar la cotización" });
  }
};

// Actualizar una cotización existente
quotationsControl.updateQuotation = async (req, res) => {
  try {
    const updatedQuotation = await quotations.esquema.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (updatedQuotation) {
      res.json({
        message: "Cotización actualizada",
        quotation: updatedQuotation,
      });
    } else {
      res.status(404).json({ message: "Cotización no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la cotización" });
  }
};

// Eliminar una cotización
quotationsControl.deleteQuotation = async (req, res) => {
  try {
    const deletedQuotation = await quotations.esquema.findByIdAndDelete(
      req.params.id
    );
    if (deletedQuotation) {
      res.json({ message: "Cotización eliminada" });
    } else {
      res.status(404).json({ message: "Cotización no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la cotización" });
  }
};

module.exports = quotationsControl;
