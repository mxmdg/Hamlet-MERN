const empresas = require("../../models/empresas");

const empresasControl = {};

empresasControl.getCompanies = async (req, res, next) => {
  {
    try {
      const tenant = req.header("x-tenant");
      const empresa = await empresas.esquema
        .find({ tenant, status: { $ne: "inactivo" } })
        .sort({ Nombre: 1 })
        .select("-__v");
      res.json(empresa);
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
};

empresasControl.getDeletedCompanies = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const empresa = await empresas.esquema
      .find({ tenant, status: { $eq: "inactivo" } })
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
      const tenant = req.header("x-tenant");
      const empresa = await empresas.esquema
        .find({ tenant })
        .lean({ virtuals: true });
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
      const tenant = req.header("x-tenant");

      // Verificar existencia dentro del tenant
      const companyExists = await empresas.esquema.findOne({
        Nombre: Nombre,
        tenant,
      });

      if (companyExists) {
        return res.status(400).json({
          message: `La empresa ${Nombre} ya se encuentra en nuestra base de datos.`,
        });
      }

      const newCompany = new empresas.esquema({
        Nombre,
        email,
        Calle,
        Ciudad,
        Codigo_Postal,
        Provincia,
        Pais,
        Telefono,
        tenant,
      });

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
    const tenant = req.header("x-tenant");
    const empresa = await empresas.esquema.findOne({
      _id: req.params.id,
      tenant,
    });
    if (empresa) {
      res.json(empresa);
    } else {
      res.status(404).json({ message: "Empresa no encontrada" });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};

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
    const tenant = req.header("x-tenant");

    const empresa = await empresas.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
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
      { new: true, runValidators: true }
    );

    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
    res.json({ message: "Empresa actualizada", empresa });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

empresasControl.deleteCompany = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const empresa = await empresas.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
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
    const tenant = req.header("x-tenant");
    const empresa = await empresas.esquema.findOne({
      _id: req.params.id,
      tenant,
    });

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
