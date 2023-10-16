const formatos = require('../../models/formatos')

const formatControl= {}

formatControl.getFormats = async (req,res)=>{{
  try {
      const formato = await formatos.esquema.find()
      res.json(formato)
      //return formato
  } catch (e) {
    return e
  }
    
  }}

  formatControl.leanFormats = async (req,res)=>{{
    try {
        const formato = await formatos.esquema.find().lean({ virtuals: true });
        return formato
    } catch (e) {
      return e
    }
    
  }}  

formatControl.addFormat = async (req,res)=>{{
    try {
        const {Nombre, Alto, Ancho} = req.body;
        const newFormat = new formatos.esquema({Nombre, Alto, Ancho});
        await newFormat.save();
        res.json({"message": newFormat.Nombre + " ha sido agregado"});
    } catch (e) {
        return e
    }
}}

formatControl.getFormat = async (req, res) => {
    try {
      const format = await formatos.esquema.findById(req.params.id);
      if (format) {
        res.json(format);
      } else {
        res.status(404).json({ message: "Formato no encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el formato" });
    }
  };
/* formatControl.updateFormat = async (req, res)=> {
    const {Nombre, Alto, Ancho} = req.body;
    const format = await formatos.esquema.findOneAndUpdate({_id: req.params.id}, {Nombre, Alto, Ancho})
    res.json({"Message": "Formato actualizado " + req.params.id})
  } */
  formatControl.updateFormat = async (req, res) => {
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
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el formato" });
    }
  };
formatControl.deleteFormat = async (req, res)=> {
    const format =  await formatos.esquema.findByIdAndDelete(req.params.id);
    res.json({"Message": "Formato eliminado"})
  }

  module.exports = formatControl