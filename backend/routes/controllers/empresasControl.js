const empresas = require("../../models/empresas");

const empresasControl = {};

empresasControl.getCompanies = async (req, res, next) => {
  {
    try {
      const empresa = await empresas.esquema
        .find({ status: { $ne: "inactivo" } })
        .sort({ Nombre: 1 })
        .select("-__v");
      res.json(empresa);
      //return formato
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
};

empresasControl.getDeletedCompanies = async (req, res, next) => {
  try {
    const empresa = await empresas.esquema
      .find({ status: { $eq: "inactivo" } })
      .sort({ Nombre: 1 })
      .select("-__v");
    res.json(empresa);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

empresasControl.leanCompanies = async (req, res, next) => {
  {
    try {
      const empresa = await empresas.esquema.find().lean({ virtuals: true });
      return empresa;
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
};

empresasControl.addCompany = async (req, res, next) => {
  {
    try {
      const {
        Nombre,
        email,
        Calle,
        Ciudad,
        Codigo_Postal,
        Provincia,
        Pais,
        Telefono,
      } = req.body;
      const newCompany = new empresas.esquema({
        Nombre,
        email,
        Calle,
        Ciudad,
        Codigo_Postal,
        Provincia,
        Pais,
        Telefono,
      });
      const companyExists = await empresas.esquema.findOne({
        Nombre: Nombre,
      });

      if (companyExists) {
        throw Error(
          `La empresa ${Nombre} ya se encuentra en nuestra base de datos.`
        );
      }

      await newCompany.save();
      res.json({ message: newCompany.Nombre + " ha sido agregado" });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
};

empresasControl.getCompany = async (req, res, next) => {
  try {
    const empresa = await empresas.esquema.findById(req.params.id);
    if (empresa) {
      res.json(empresa);
    } else {
      res.status(404).json({ message: "Empresa no encontrado" });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};
/* empresasControl.updateFormat = async (req, res)=> {
    const {Nombre, Alto, Ancho} = req.body;
    const format = await empresas.esquema.findOneAndUpdate({_id: req.params.id}, {Nombre, Alto, Ancho})
    res.json({"Message": "Formato actualizado " + req.params.id})
  } */
empresasControl.updateCompany = async (req, res, next) => {
  try {
    const {
      Nombre,
      email,
      Calle,
      Ciudad,
      Codigo_Postal,
      Provincia,
      Pais,
      Telefono,
      status,
    } = req.body;
    const empresa = await empresas.esquema.findByIdAndUpdate(
      req.params.id,
      {
        Nombre,
        email,
        Calle,
        Ciudad,
        Codigo_Postal,
        Provincia,
        Pais,
        Telefono,
        status,
      },
      { new: false }
    );

    if (!empresa) {
      throw Error("Empresa no encontrada");
    }
    res.json({ message: "Empresa actualizado", empresa });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
empresasControl.deleteCompany = async (req, res, next) => {
  try {
    const empresa = await empresas.esquema.findByIdAndUpdate(
      req.params.id,
      { status: "inactivo" },
      { new: true, runValidators: true }
    );

    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    res.json({
      message: "Empresa desactivada",
      empresa,
    });
  } catch (e) {
    next(e);
  }
};

empresasControl.updateStatus = async (req, res, next) => {
  try {
    const empresa = await empresas.esquema.findById(req.params.id);

    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    empresa.status = empresa.status === "activo" ? "inactivo" : "activo";
    await empresa.save();

    res.json({
      message: `Empresa ${empresa.Nombre} actualizado`,
      empresa,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = empresasControl;
