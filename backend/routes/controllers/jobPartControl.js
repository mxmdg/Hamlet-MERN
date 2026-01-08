const jobParts = require("../../models/jobParts");

const jobPartsControl = {};

jobPartsControl.getJobParts = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const jobPart = await jobParts.esquema
      .find({ tenant, status: { $ne: "inactivo" } })
      .select("-__v");
    res.json(jobPart);
  } catch (error) {
    next(error);
  }
};

jobPartsControl.getDeletedJobParts = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const jobPart = await jobParts.esquema
      .find({ tenant, status: { $eq: "inactivo" } })
      .select("-__v");
    res.json(jobPart);
  } catch (error) {
    next(error);
  }
};

jobPartsControl.addJobPart = async (req, res) => {
  try {
    const {
      Type,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      minPages,
      maxPages,
      PrintModAllowed,
      minStockWeight,
      maxStockWeight,
      jobTypesAllowed,
    } = req.body;
    const tenant = req.header("x-tenant");
    const newJobPart = new jobParts.esquema({
      Type,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      minPages,
      maxPages,
      PrintModAllowed,
      minStockWeight,
      maxStockWeight,
      jobTypesAllowed,
      tenant,
    });
    await newJobPart.save();
    res.json({ message: newJobPart.Type + " guardado OK" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al guardar el jobPart" });
    throw error;
  }
};

jobPartsControl.getJobPart = async (req, res) => {
  try {
    const tenant = req.header("x-tenant");
    const jobPart = await jobParts.esquema.findOne({
      _id: req.params.id,
      tenant,
    });
    if (jobPart) {
      res.json(jobPart);
    } else {
      res.status(404).json({ message: "jobPart no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el jobPart" });
  }
};

jobPartsControl.updateJobPart = async (req, res) => {
  try {
    const {
      Type,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      minPages,
      maxPages,
      PrintModAllowed,
      minStockWeight,
      maxStockWeight,
      jobTypesAllowed,
    } = req.body;
    const tenant = req.header("x-tenant");
    const JobPart = await jobParts.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
      {
        Type,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        minPages,
        maxPages,
        PrintModAllowed,
        minStockWeight,
        maxStockWeight,
        jobTypesAllowed,
      },
      { new: true }
    );
    if (!JobPart)
      return res.status(404).json({ message: "jobPart no encontrado" });
    res.json({ Message: "JobPart actualizado " + JobPart.Type });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al guardar el jobPart" });
    throw error;
  }
};

jobPartsControl.deleteJobPart = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const jobPart = await jobParts.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
      { status: "inactivo" },
      { new: true }
    );
    if (!jobPart)
      return res.status(404).json({ message: "jobPart no encontrado" });
    res.json({ Message: "jobPart desactivado", jobPart });
  } catch (error) {
    next(error);
  }
};

jobPartsControl.updateStatus = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const jp = await jobParts.esquema.findOne({ _id: req.params.id, tenant });
    if (!jp) return res.status(404).json({ message: "jobPart no encontrado" });
    jp.status = jp.status === "activo" ? "inactivo" : "activo";
    await jp.save();
    res.json({ message: "Estado actualizado", jobPart: jp });
  } catch (error) {
    next(error);
  }
};

module.exports = jobPartsControl;
