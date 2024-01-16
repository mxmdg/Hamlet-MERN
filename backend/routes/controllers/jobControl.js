const jobs = require("../../models/Jobs");
const users = require("../../models/usersSchema");
const companies = require("../../models/empresas");
const stocks = require("../../models/materiales");

const jobControl = {};

jobControl.getJobs = async (req, res) => {
  {
    try {
      const queryText = req.query.Q || "";
      const jobList = await jobs.esquema
        .find({
          Nombre: { $regex: queryText, $options: "i" },
        })
        .select("Nombre Cantidad Fecha Entrega Emision Deadline")
        .sort({ Nombre: -1 });
      res.json(jobList);
    } catch (e) {
      throw e;
    }
  }
};

jobControl.getJobsParts = async (req, res) => {
  {
    try {
      const queryText = req.query.Q || "";
      const jobPartsList = await jobs.esquema.find().select("Partes");
      res.json(jobPartsList);
    } catch (e) {
      throw e;
    }
  }
};

jobControl.getUrgentJobs = async (req, res) => {
  const currentDate = new Date();
  const daysLater = new Date();
  daysLater.setDate(currentDate.getDate() + 7);
  try {
    {
      const queryText = req.query.Q || "";
      const jobList = await jobs.esquema
        .find({ Entrega: { $gte: currentDate, $lt: daysLater } })
        .select("Nombre Cantidad Fecha Entrega Emision Deadline");
      res.json(jobList);
    }
  } catch (e) {
    throw e;
  }
};

jobControl.addJob = async (req, res) => {
  {
    try {
      const Nombre = req.body.jobName;
      const Tipo = req.body.JobType;
      const Cantidad = req.body.quantity;
      const Partes = req.body.Partes;
      const Entrega = req.body.endDate;
      const Owner = req.body.Owner;
      const Company = req.body.Company;
      //const Archivos = '/uploads/' + req.file.filename;
      const newJob = new jobs.esquema({
        Nombre,
        Tipo,
        Cantidad,
        Entrega,
        Partes,
        Owner,
        Company,
      });
      await newJob.save();
      console.log(`Trabajo agregado`);
      res.json({ message: newJob.Nombre + " guardado OK" });
    } catch (e) {
      res.status(404).json({ message: "Error: " + e.message });
    }
  }
};

jobControl.getJob = async (req, res) => {
  try {
    const job = await jobs.esquema
      .findById(req.params.id)
      .populate({
        path: "Owner",
        model: users.esquema,
        select: "Name LastName Role email",
      })
      .populate({
        path: "Company",
        model: companies.esquema,
        select: "Nombre email",
      })
      .populate({ path: "Partes.partStock", model: stocks.esquema });
    res.json(job);
  } catch (e) {
    res.status(404).json({ message: "Trabajo no encontrado: " + e.message });
  }
};
jobControl.updateJob = async (req, res) => {
  const { Nombre, Alto, Ancho } = req.body;
  const format = await formatos.esquema.findOneAndUpdate(
    { _id: req.params.id },
    { Nombre, Alto, Ancho }
  );
  res.json({ Message: "Formato actualizado " + req.params.id });
};
jobControl.deleteJob = async (req, res) => {
  const producto = await jobs.esquema.findByIdAndDelete(req.params.id);
  res.json({ Message: "Trabajo borrado" });
};

module.exports = jobControl;
