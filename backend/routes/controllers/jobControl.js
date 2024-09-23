const jobs = require("../../models/Jobs");
const users = require("../../models/usersSchema");
const companies = require("../../models/empresas");
const stocks = require("../../models/materiales");
const finishers = require("../../models/finishers");

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
        parte = parte.toObject();
        parte.Material = `${parte.partStock.Marca} ${parte.partStock.Tipo} ${parte.partStock.Gramaje}`;
        flattenedPartsList.push(parte);
      });
    });
    //console.log(flattenedPartsList);
    res.json(flattenedPartsList);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

jobControl.getUrgentJobs = async (req, res) => {
  //console.log(req.query.startDate);
  const startDate = req.query.startDate
    ? new Date(req.query.startDate)
    : new Date();
  const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

  if (req.query.endDate) {
    endDate.setDate(endDate.getDate() + 1); // Para incluir el día completo
  } else {
    startDate.setDate(startDate.getDate() - 1); // Por defecto incluye hoy
    endDate.setDate(startDate.getDate() + 8); // Por defecto, la próxima semana
  }
  try {
    //console.log(startDate, endDate);
    {
      const queryText = req.query.Q || "";
      const jobList = await jobs.esquema
        .find({ Entrega: { $gte: startDate, $lt: endDate } })
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
        .sort({ Entrega: +1 });
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
      const Finishing = req.body.Finishing;
      //const Archivos = '/uploads/' + req.file.filename;
      const newJob = new jobs.esquema({
        Nombre,
        Tipo,
        Cantidad,
        Entrega,
        Partes,
        Owner,
        Company,
        Finishing,
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
      .populate({ path: "Partes.partStock", model: stocks.esquema })
      .populate({ path: "Partes.Finishing", select: "Modelo Proceso Costo.Valor"});
    res.json(job);
  } catch (e) {
    res.status(404).json({ message: "Trabajo no encontrado: " + e.message });
  }
};
jobControl.updateJob = async (req, res) => {
  {
    try {
      const Nombre = req.body.Nombre;
      const Tipo = req.body.JobType;
      const Cantidad = req.body.Cantidad;
      const Partes = req.body.Partes;
      const Entrega = req.body.Entrega;
      const Owner = req.body.Owner;
      const Company = req.body.Company;
      const Finishing = req.body.Finishing;
      //const Archivos = '/uploads/' + req.file.filename;
      const newJob = new jobs.esquema({
        Nombre,
        Tipo,
        Cantidad,
        Entrega,
        Partes,
        Owner,
        Company,
        Finishing,
      });
      await jobs.esquema.findOneAndUpdate(
        { _id: req.params.id },
        { Nombre, Tipo, Cantidad, Partes, Entrega, Owner, Company, Finishing }
      );
      console.log(`Trabajo agregado`);
      res.json({ message: newJob.Nombre + " guardado OK" });
    } catch (e) {
      res.status(404).json({ message: "Error: " + e.message });
    }
  }
};
jobControl.deleteJob = async (req, res) => {
  const producto = await jobs.esquema.findByIdAndDelete(req.params.id);
  res.json({ Message: "Trabajo borrado" });
};

module.exports = jobControl;
