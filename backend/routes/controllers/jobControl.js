const jobs = require("../../models/Jobs");
const users = require("../../models/usersSchema");
const companies = require("../../models/empresas");
const stocks = require("../../models/materiales");
const finishers = require("../../models/finishers");

const jobControl = {};

jobControl.getJobs = async (req, res, next) => {
  try {
    const queryText = req.query.Q || "";
    const jobList = await jobs.esquema
      .find({
        tenant: req.header("x-tenant"),
        Nombre: { $regex: queryText, $options: "i" },
        status: { $ne: "inactivo" },
      })
      .select("Nombre Cantidad Fecha Entrega Emision Deadline Owner")
      .sort({ Fecha: -1 });
    res.json(jobList);
  } catch (e) {
    next(e);
  }
};

jobControl.getDeletedJobs = async (req, res, next) => {
  try {
    const queryText = req.query.Q || "";
    const jobList = await jobs.esquema
      .find({
        tenant: req.header("x-tenant"),
        Nombre: { $regex: queryText, $options: "i" },
        status: { $eq: "inactivo" },
      })
      .select("Nombre Cantidad Fecha Entrega Emision Deadline Owner")
      .sort({ Fecha: -1 });
    res.json(jobList);
  } catch (e) {
    next(e);
  }
};

// Obtener trabajos completos con filtros avanzados

jobControl.getCompleteJobs = async (req, res) => {
  {
    try {
      const queryText = req.query.Q || "";
      const property = req.query.P || "Nombre";
      let operator = req.query.OP || "eq"; // Default to 'eq' if not provided
      const schemaType = jobs.esquema.schema.paths[property]?.instance;
      const max = req.query.M || null;

      let query;
      if (operator === "bt" && max !== null && property !== "Partes") {
        query = {
          [property]: { $gte: Number(queryText), $lte: Number(max) },
        };
      } else if (property === "Fecha" || property === "Entrega") {
        // Buscar fechas parcialmente usando $expr y $dateToString
        query = {
          $expr: {
            $regexMatch: {
              input: {
                $dateToString: {
                  format: "%Y-%m-%dT%H:%M:%S.%LZ",
                  date: `$${property}`,
                },
              },
              regex: queryText,
              options: "i",
            },
          },
        };
      } else if (property === "Partes.Name") {
        // buscar por igualdad
        // query = { [property]:  queryText};
        // Si es un array, buscar por nombre de parte
        query = { [property]: { $regex: queryText } };
      } else if (schemaType === "String") {
        // Para texto, usar regex
        query = { [property]: { $regex: queryText, $options: "i" } };
      } else if (schemaType === "Number") {
        // Para números, usar operador dinámico
        operator === "bt" ? (operator = "eq") : operator;
        query = { [property]: { [`$${operator}`]: Number(queryText) } };
      } else if (
        property === "Partes.Pages" ||
        property === "Partes.Alto" ||
        property === "Partes.Ancho"
      ) {
        // Para números, usar operador dinámico
        query = { [property]: { [`$${operator}`]: Number(queryText) } };
      } else if (schemaType === "ObjectID") {
        // Para IDs, buscar por igualdad
        query = { [property]: queryText };
      } else if (property === "Tipo") {
        // El tipo de trabajo es un array, hay que buscar la propiedad name en la posicion 0
        query = { [Tipo[0].name]: { $regex: queryText, $options: "i" } };
      } else if (property === "Partes") {
        // Ejemplo para arrays
        query = { [property]: { $size: parseInt(queryText) } };
      } else {
        // Por defecto, buscar por igualdad
        query = { [property]: queryText };
      }

      query.tenant = req.header("x-tenant");

      const jobList = await jobs.esquema
        .find(query)
        .select(
          "-Finishing.Costo.Historial  -Finishing.jobTypesAllowed -Finishing.partTypesAllowed"
        )
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
        .populate({
          path: "Partes.Finishing",
          model: finishers.esquema,
          select: "-Costo.Historial -jobTypesAllowed -partTypesAllowed",
        })
        /* .populate({
          path: "Finishing",
          model: finishers.esquema,
          select: "-Costo.Historial -jobTypesAllowed -partTypesAllowed",
        }) */
        .sort({ Fecha: -1 });
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
        parte.Owner = item.ownerDocument();
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
  const startDate = req.query.startDate
    ? new Date(req.query.startDate)
    : new Date();
  const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

  if (req.query.endDate) {
    endDate.setDate(endDate.getDate() + 1); // Para incluir el día completo
  } else {
    startDate.setDate(startDate.getDate() - 1); // Por defecto incluye hoy
    endDate.setDate(startDate.getDate() + 60); // Por defecto, la próxima semana
  }
  try {
    //console.log(startDate, endDate);
    {
      const queryText = req.query.Q || "";
      const jobList = await jobs.esquema
        .find({
          tenant: req.header("x-tenant"),
          Entrega: { $gte: startDate, $lt: endDate },
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
        .populate({
          path: "Partes.Finishing",
          model: finishers.esquema,
          select: "-Costo.Historial -jobTypesAllowed -partTypesAllowed",
        })
        /* .populate({
          path: "Finishing",
          model: finishers.esquema,
          select: "-Costo.Historial -jobTypesAllowed -partTypesAllowed",
        }) */
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
        /* .find({ Owner: { $eq: currentUserId } })
        .select("Nombre Cantidad Fecha Entrega Emision Deadline");
      res.json(jobList); */
        .find({
          tenant: req.header("x-tenant"),
          Owner: { $eq: currentUserId },
        })
        .select(
          "-Finishing.Costo.Historial  -Finishing.jobTypesAllowed -Finishing.partTypesAllowed"
        )
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
        .populate({
          path: "Partes.Finishing",
          model: finishers.esquema,
          select: "-Costo.Historial -jobTypesAllowed -partTypesAllowed",
        })
        .sort({ Fecha: -1 });
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
        .find({
          tenant: req.header("x-tenant"),
          Company: { $eq: currentUserId },
        })
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
        tenant: req.header("x-tenant"),
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
      console.log(`${Nombre} agregado`);
      res.json(newJob._id);
    } catch (e) {
      res.status(404).json({ message: "Error: " + e.message });
    }
  }
};

jobControl.getJob = async (req, res) => {
  try {
    const tenant = req.header("x-tenant");
    const job = await jobs.esquema
      .findOne({
        tenant,
        _id: req.params.id,
      })
      .select(
        "-Finishing.Costo.Historial  -Finishing.jobTypesAllowed -Finishing.partTypesAllowed"
      )
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

    // Si no se encontró el trabajo
    if (!job) {
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }

    // Comprobar si hay partes vacías (mantener compatibilidad con lógica previa)
    if (job.Partes?.Finishing && job.Partes?.Finishing[0] === null) {
      job.Partes.Finishing = [];
    }

    res.json(job);
  } catch (e) {
    console.log(e);
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
        {
          _id: req.params.id,
          tenant: req.header("x-tenant"),
        },
        { Nombre, Tipo, Cantidad, Partes, Entrega, Owner, Company, Finishing }
      );
      console.log(newJob.Nombre + " guardado OK");
      res.json({
        message: newJob.Nombre + " guardado OK" + newJob.Finishing[0],
      });
    } catch (e) {
      res.status(404).json({ message: "Error: " + e.message });
    }
  }
};
jobControl.deleteJob = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const producto = await jobs.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
      { status: "inactivo" },
      { new: true }
    );
    if (!producto)
      return res.status(404).json({ message: "Trabajo no encontrado" });
    res.json({ Message: "Trabajo desactivado", job: producto });
  } catch (e) {
    next(e);
  }
};

jobControl.updateStatus = async (req, res, next) => {
  try {
    const job = await jobs.esquema.findOne({
      _id: req.params.id,
      tenant: req.header("x-tenant"),
    });

    if (!job) {
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }

    job.status = job.status === "activo" ? "inactivo" : "activo";
    await job.save();

    res.json({ message: "Estado actualizado", job });
  } catch (e) {
    next(e);
  }
};

module.exports = jobControl;
