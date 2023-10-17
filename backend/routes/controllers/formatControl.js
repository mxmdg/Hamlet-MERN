const formatos = require('../../models/formatos')

const formatControl= {}

formatControl.getFormats = async (req,res, next)=>{{
  try {
      const formato = await formatos.esquema.find()
      res.json(formato)
      //return formato
  } catch (e) {
    console.error(e);
    next(e);
  }
    
  }}

  formatControl.leanFormats = async (req,res, next)=>{{
    try {
        const formato = await formatos.esquema.find().lean({ virtuals: true });
        return formato
    } catch (e) {
      console.error(e);
      next(e);
    }
    
  }}  

formatControl.addFormat = async (req,res, next)=>{{
    try {
        const {Nombre, Alto, Ancho} = req.body;
        const newFormat = new formatos.esquema({Nombre, Alto, Ancho});
        await newFormat.save();
        res.json({"message": newFormat.Nombre + " ha sido agregado"});
    } catch (e) {
      console.error(e);
      next(e);
    }
}}

formatControl.getFormat = async (req,res, next) => {
    try {
      const format = await formatos.esquema.findById(req.params.id);
      if (format) {
        res.json(format);
      } else {
        res.status(404).json({ message: "Formato no encontrado" });
      }
    } catch (error) {
      console.error(e);
      next(e);
    }
  };
/* formatControl.updateFormat = async (req, res)=> {
    const {Nombre, Alto, Ancho} = req.body;
    const format = await formatos.esquema.findOneAndUpdate({_id: req.params.id}, {Nombre, Alto, Ancho})
    res.json({"Message": "Formato actualizado " + req.params.id})
  } */
  formatControl.updateFormat = async (req,res, next) => {
    try {
      const { Nombre, Alto, Ancho } = req.body;
      const format = await formatos.esquema.findByIdAndUpdate(
        req.params.id,
        { Nombre, Alto, Ancho },
        { new: false }
      );
      if (!format) {
        return res.status(404).json({ message: "Formato no encontrado" });
      }
      res.json({ message: "Formato actualizado", format });
    } catch (error) {
      console.error(e);
      next(e);
    }
  };
formatControl.deleteFormat = async (req,res, next)=> {
  try {
    const format =  await formatos.esquema.findByIdAndDelete(req.params.id);
    res.json({"Message": "Formato eliminado"})
  } catch (error) {
    console.error(e);
    next(e);
  }

    
  }

  module.exports = formatControl