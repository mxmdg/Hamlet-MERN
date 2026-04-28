const troubles = require("../../models/troubles");
const Printers = require("../../models/printers");
const Material  = require("../../models/materiales");
const Job = require("../../models/Jobs");

// Opción B: Acceder a la propiedad esquema en el populate
// (Aunque es mejor la Opción A para mantener limpio el código)

const troubleControl = {};

const normalizeSourceType = (value) => {
  if (!value) return value;

  switch (String(value).toLowerCase()) {
    case "printer":
    case "impresora":
    case "printers":
      return "printers";
    case "material":
    case "materiales":
      return "materiales";
    case "job":
    case "jobs":
    case "trabajo":
      return "jobs";
    default:
      return value;
  }
};

const getSourceModel = (sourceType) => {
  switch (normalizeSourceType(sourceType)) {
    case "Printers":
      return Printers;
    case "materiales":
      return Material;
    case "jobs":
      return Job;
    default:
      return undefined;
  }
};

troubleControl.getTroubles = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    
    // Aseguramos que los modelos estén cargados antes de la consulta
    // (Esto "despierta" a Mongoose si los archivos no se importaron todavía)
    const troubleList = await troubles.esquema
      .find({ tenant, status: { $ne: "inactivo" } })
      .select("-__v -tenant")
      /* .populate({
        path: "sourceId",
        // IMPORTANTE: refPath en el Schema ya sabe a qué modelo mirar.
        // Si usás refPath, NO necesitas pasarle el 'model' manualmente acá.
      }); */
      
    res.json(troubleList);
  } catch (error) {
    console.log("Error en GetTroubles:", error);
    next(error);
  }
};

troubleControl.getTroubleBySource = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const { sourceId } = req.params;
    const sourceType = normalizeSourceType(req.params.sourceType);
    const trouble = await troubles.esquema
      .find({ tenant, sourceType, sourceId, status: { $ne: "inactivo" } })
      .select("-__v")
      .populate({
        path: "sourceId",
        model: (doc) => getSourceModel(doc.sourceType),
      });
    res.json(trouble);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

troubleControl.getTrouble = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const trouble = await troubles.esquema
      .findOne({ _id: req.params.id, tenant, status: { $ne: "inactivo" } })
      .select("-__v")
      // .populate({
      //   path: "sourceId",
      //   model: (doc) => getSourceModel(doc.sourceType),
      // });
    res.json(trouble);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

troubleControl.getDeletedTroubles = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const trouble = await troubles.esquema
      .find({ tenant, status: { $eq: "inactivo" } })
      .select("-__v -tenant")
      // .populate({
      //   path: "sourceId",
      //   model: (doc) => getSourceModel(doc.sourceType),
      // });
    res.json(trouble);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

troubleControl.addTrouble = async (req, res, next) => {
  try {
    const { sourceId, code, description, solution, severity } = req.body;
    const sourceType = normalizeSourceType(req.body.sourceType);
    const tenant = req.header("x-tenant");
    const newTrouble = new troubles.esquema({
      sourceType,
      sourceId,
      code,
      description,
      solution,
      severity,
      tenant,
    });
    const savedTrouble = await newTrouble.save();
    res.status(201).json(savedTrouble);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

troubleControl.updateTrouble = async (req, res, next) => {
  try {
    const { sourceId, code, description, solution, severity } = req.body;
    const sourceType = normalizeSourceType(req.body.sourceType);
    const tenant = req.header("x-tenant");
    const updatedTrouble = await troubles.esquema.findByIdAndUpdate(
      req.params.id,
      {
        sourceType,
        sourceId,
        code,
        description,
        solution,
        severity,
        tenant,
      },
      { new: true },
    );
    res.json(updatedTrouble);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

troubleControl.deleteTrouble = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const deletedTrouble = await troubles.esquema.findByIdAndUpdate(
      req.params.id,
      { status: "inactivo", tenant },
      { new: true },
    );
    res.json(deletedTrouble);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = troubleControl;
