const formatos = require("../../models/formatos");

const formatControl = {};

formatControl.getFormats = async (req, res, next) => {
  {
    try {
      const tenant = req.header("x-tenant");
      const formato = await formatos.esquema
        .find({ tenant, status: { $ne: "inactivo" } })
        .sort({ Nombre: 1 })
        .select("-__v");
      res.json(formato);
      //return formato
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
};

formatControl.getDeletedFormats = async (req, res, next) => {
  {
    try {
      const tenant = req.header("x-tenant");
      const formato = await formatos.esquema
        .find({ tenant, status: { $eq: "inactivo" } })
        .sort({ Nombre: 1 })
        .select("-__v");
      res.json(formato);
      //return formato
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
};

formatControl.leanFormats = async (req, res, next) => {
  {
    try {
      const tenant = req.header("x-tenant");
      const formato = await formatos.esquema
        .find({ tenant })
        .lean({ virtuals: true });
      return formato;
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
};

formatControl.addFormat = async (req, res, next) => {
  {
    try {
      const { Nombre, Alto, Ancho } = req.body;
      const tenant = req.header("x-tenant");
      const newFormat = new formatos.esquema({
        Nombre,
        Alto,
        Ancho,
        tenant,
      });
      await newFormat.save();
      res.json({
        message: newFormat.Nombre + " ha sido agregado",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
};

formatControl.getFormat = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const format = await formatos.esquema.findOne({
      _id: req.params.id,
      tenant,
    });
    if (format) {
      console.log(format);
      res.json(format);
    } else {
      res.status(404).json({ message: "Formato no encontrado" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};
/* formatControl.updateFormat = async (req, res)=> {
    const {Nombre, Alto, Ancho} = req.body;
    const format = await formatos.esquema.findOneAndUpdate({_id: req.params.id}, {Nombre, Alto, Ancho})
    res.json({"Message": "Formato actualizado " + req.params.id})
  } */
formatControl.updateFormat = async (req, res, next) => {
  try {
    const { Nombre, Alto, Ancho } = req.body;
    const tenant = req.header("x-tenant");
    const format = await formatos.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
      { Nombre, Alto, Ancho },
      { new: true },
    );
    if (!format) {
      return res.status(404).json({ message: "Formato no encontrado" });
    }
    res.json({ message: "Formato actualizado", format });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

formatControl.deleteFormat = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const format = await formatos.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
      { status: "inactivo" },
      { new: true },
    );

    if (!format) {
      return res.status(404).json({ message: "Formato no encontrado" });
    }

    res.json({
      message: `Formato ${format.Nombre || ""} desactivado`,
      format,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

formatControl.updateStatus = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const format = await formatos.esquema.findOne({
      _id: req.params.id,
      tenant,
    });

    if (!format) {
      return res.status(404).json({ message: "Formato no encontrado" });
    }

    const newStatus = format.status === "activo" ? "inactivo" : "activo";

    format.status = newStatus;
    await format.save();

    res.json({
      message: "Estado actualizado",
      format,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = formatControl;
