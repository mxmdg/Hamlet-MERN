const empresas = require("../../models/empresas");

const empresasControl = {};

empresasControl.getCompanies = async (req, res, next) => {
  {
    try {
      const empresa = await empresas.esquema.find().sort({ Nombre: 1 });
      res.json(empresa);
      //return formato
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
};

empresasControl.leanCompanies = async (req, res, next) => {
  {
    try {
      const empresa = await empresas.esquema.find().lean({ virtuals: true });
      return empresa;
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
};

empresasControl.addCompany = async (req, res, next) => {
  {
    try {
      const { Nombre, email, Calle, Ciudad, Codigo_Postal, Provincia, Pais, Telefono } = req.body;
      const newCompany = new empresas.esquema({ Nombre, email, Calle, Ciudad, Codigo_Postal, Provincia, Pais, Telefono });
      await newCompany.save();
      res.json({ message: newCompany.Nombre + " ha sido agregado" });
    } catch (e) {
      console.error(e);
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
  } catch (error) {
    console.error(e);
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
    const { Nombre, email, Calle, Ciudad, Codigo_Postal, Provincia, Pais, Telefono } = req.body;
    const empresa = await empresas.esquema.findByIdAndUpdate(
      req.params.id,
      { Nombre, email, Calle, Ciudad, Codigo_Postal, Provincia, Pais, Telefono },
      { new: false }
    );
    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
    res.json({ message: "Empresa actualizado", empresa });
  } catch (error) {
    console.error(e);
    next(e);
  }
};
empresasControl.deleteCompany = async (req, res, next) => {
  try {
    const empresa = await empresas.esquema.findByIdAndDelete(req.params.id);
    res.json({ Message: "empresa eliminada" });
  } catch (error) {
    console.error(e);
    next(e);
  }
};

module.exports = empresasControl;
