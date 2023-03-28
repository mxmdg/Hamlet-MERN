const formatos = require('../../models/formatos')

const formatControl= {}

formatControl.getFormats = async (req,res)=>{{
    const formato = await formatos.esquema.find()
    res.json(formato)}}

formatControl.addFormat = async (req,res)=>{{
    try {
        const {Nombre, Alto, Ancho} = req.body;
        const newFormat = new formatos.esquema({Nombre, Alto, Ancho});
        await newFormat.save();
        res.json({"message": newFormat.Nombre + " ha sido agregado"});
    } catch (e) {
        console.log(e)
    }
}}

formatControl.getFormat = async (req, res)=> {
    console.log(req.params.id)
    res.json({"Message": "Formato encontrado " + req.params.id})
  }
formatControl.updateFormat = async (req, res)=> {
    const {Nombre, Alto, Ancho} = req.body;
    const format = await formatos.esquema.findOneAndUpdate({_id: req.params.id}, {Nombre, Alto, Ancho})
    res.json({"Message": "Formato actualizado " + req.params.id})
  }
formatControl.deleteFormat = async (req, res)=> {
    const format =  await formatos.esquema.findByIdAndDelete(req.params.id);
    res.json({"Message": "Formato eliminado"})
  }

  module.exports = formatControl