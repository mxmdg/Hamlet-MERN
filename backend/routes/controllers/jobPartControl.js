const jobParts = require("../../models/jobParts");

const jobPartsControl = {};

jobPartsControl.getJobParts = async (req, res, next) => {
  try {
    const jobPart = await jobParts.esquema
      .find({ status: { $ne: "inactivo" } })
      .select("-__v");
    res.json(jobPart);
  } catch (error) {
    next(error);
  }
};

jobPartsControl.getDeletedJobParts = async (req, res, next) => {
  try {
    const jobPart = await jobParts.esquema
      .find({ status: { $eq: "inactivo" } })
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
    const jobPart = await jobParts.esquema.findById(req.params.id);
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
    const JobPart = await jobParts.esquema.findOneAndUpdate(
      { _id: req.params.id },
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
      }
    );
    res.json({ Message: "JobPart actualizado " + JobPart.Type });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al guardar el jobPart" });
    throw error;
  }
};
jobPartsControl.deleteJobPart = async (req, res, next) => {
  try {
    const jobPart = await jobParts.esquema.findByIdAndUpdate(
      req.params.id,
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
    const jp = await jobParts.esquema.findById(req.params.id);
    if (!jp) return res.status(404).json({ message: "jobPart no encontrado" });
    jp.status = jp.status === "activo" ? "inactivo" : "activo";
    await jp.save();
    res.json({ message: "Estado actualizado", jobPart: jp });
  } catch (error) {
    next(error);
  }
};

module.exports = jobPartsControl;
