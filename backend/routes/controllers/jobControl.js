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
        .select("Nombre Cantidad Fecha Entrega Emision Deadline Owner")
        .sort({ Nombre: -1 });
      res.json(jobList);
    } catch (e) {
      throw e;
    }
  }
};

jobControl.getCompleteJobs = async (req, res) => {
  {
    try {
      const queryText = req.query.Q || "";
      const jobList = await jobs.esquema
        .find({
          Nombre: { $regex: queryText, $options: "i" },
        })
        .populate({
          path: "Owner",
          model: users.esquema,
        })
        .populate({
          path: "Company",
          model: companies.esquema,
          select: "Nombre email",
        })
        .populate({ path: "Partes.partStock", model: stocks.esquema })
        .sort({ Nombre: -1 });
      res.json(jobList);
    } catch (e) {
      throw e;
    }
  }
};

jobControl.getAllParts = async (req, res) => {
  const fields = "Partes";
  try {
    const partsList = await jobs.esquema
      .find()
      .select(fields)
      .populate({ path: "Partes.partStock", model: stocks.esquema });
    let flattenedPartsList = [];
    partsList.forEach((item) => {
      item.Partes.forEach((parte) => {
        const paper = parte.partStock.Tipo + " " + parte.partStock.Gramaje;
        parte.partStock = paper;
        flattenedPartsList.push(parte);
      });
    });
    console.log("flattenedPartsList");
    console.log(flattenedPartsList);
    res.json(flattenedPartsList);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

jobControl.getUrgentJobs = async (req, res) => {
  const currentDate = new Date();
  const daysLater = new Date();
  daysLater.setDate(currentDate.getDate() + 8);
  try {
    {
      const queryText = req.query.Q || "";
      const jobList = await jobs.esquema
        .find({ Entrega: { $gte: currentDate, $lt: daysLater } })
        .populate({
          path: "Owner",
          model: users.esquema,
        })
        .populate({
          path: "Company",
          model: companies.esquema,
          select: "Nombre email",
        })
        .populate({ path: "Partes.partStock", model: stocks.esquema });
      //.select("Nombre Cantidad Fecha Entrega Emision Deadline");
      res.json(jobList);
    }
  } catch (e) {
    throw e;
  }
};

jobControl.getOwnerJobs = async (req, res) => {
  try {
    {
      const queryText = req.query.Q || "";
      const currentUserId = req.params.id;
      const jobList = await jobs.esquema
        .find({ Owner: { $eq: currentUserId } })
        .select("Nombre Cantidad Fecha Entrega Emision Deadline");
      res.json(jobList);
    }
  } catch (e) {
    throw e;
  }
};

jobControl.getCompanyJobs = async (req, res) => {
  try {
    {
      const queryText = req.query.Q || "";
      const currentUserId = req.params.id;
      const jobList = await jobs.esquema
        .find({ Company: { $eq: currentUserId } })
        .populate({
          path: "Owner",
          model: users.esquema,
        })
        .populate({
          path: "Company",
          model: companies.esquema,
          select: "Nombre email",
        });
      res.json(jobList);
    }
  } catch (e) {
    throw e;
  }
};

jobControl.addJob = async (req, res) => {
  {
    try {
      const Nombre = req.body.Nombre;
      const Tipo = req.body.JobType;
      const Cantidad = req.body.Cantidad;
      const Partes = req.body.Partes;
      const Entrega = req.body.Entrega;
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
