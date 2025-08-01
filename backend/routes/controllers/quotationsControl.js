const quotations = require("../../models/quotations");
const Jobs = require("../../models/Jobs");
const Users = require("../../models/usersSchema")

const quotationsControl = {};

// Obtener todas las cotizaciones - Filtros avanzados
quotationsControl.getQuotations = async (req, res) => {
  try {
    const queryText = req.query.Q || "";
    const property = req.query.P || "name";
    let operator = req.query.OP || "eq"; // Default to 'eq' if not provided
    const schemaType = quotations.esquema.schema.paths[property]?.instance;
    const max = req.query.M || null;

    let query;
    if (operator === "bt") {
      query = {
        [property]: { $gte: Number(queryText), $lte: Number(max) },
      };
    } else if (schemaType === "String") {
      // Para texto, usar regex
      query = { [property]: { $regex: queryText, $options: "i" } };
    } else if (schemaType === "Date") {
  // Buscar fechas parcialmente usando $expr y $dateToString
  query = {
    $expr: {
      $regexMatch: {
        input: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: `$${property}` } },
        regex: queryText,
        options: "i"
      }
    }
  };
} else if (schemaType === "Number") {
      // Para números, usar operador dinámico
      operator === "bt" ? (operator = "eq") : operator;
      query = { [property]: { [`$${operator}`]: Number(queryText) } };
    } else if (schemaType === "ObjectID") {
      // Para IDs, buscar por igualdad
      query = { [property]: queryText };
    } else if (property === "data.resumen") {
      // Ejemplo para arrays
      query = { [property]: { $size: parseInt(queryText) } };
    } else {
      // Por defecto, buscar por igualdad
      query = { [property]: queryText };
    }

    const allQuotations = await quotations.esquema
      .find(query)
      .populate({ path: "jobId", model: Jobs.esquema, select: "Nombre Owner Entrega" })
      .populate({path: "owner", model: Users.esquema})
      .sort({ index: -1 }); // Ordenar por índice descendente

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
