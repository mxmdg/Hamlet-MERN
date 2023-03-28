const materials = require('../../models/materiales')

const materialControl= {}

materialControl.getMaterials = async (req,res) => {{
    const material = await materials.esquema.find()
    res.json(material);
}}

materialControl.addMaterial = async (req,res)=>{{
    const {Nombre_Material, Marca, Gramaje, Tipo, Ancho_Resma, Alto_Resma, Espesor_Resma, Fibra, Precio_x_Kilo, Color} = req.body;
    const newMaterial = new materials.esquema({Nombre_Material, Marca, Gramaje, Tipo, Ancho_Resma, Alto_Resma, Espesor_Resma, Fibra, Precio_x_Kilo, Color});
    await newMaterial.save();
    res.json({"message": newMaterial.Nombre + " guardado OK"});
    
}}

materialControl.getMaterial = async (req, res)=> {
    console.log(req.params.id)
    res.json({"Message": "Material encontrado " + req.params.id})
}
materialControl.updateMaterial = async (req, res)=> {
    const {Nombre_Material, Marca, Gramaje, Tipo, Ancho_Resma, Alto_Resma, Espesor_Resma, Fibra, Precio_x_Kilo, Color} = req.body;
    const material = await materials.esquema.findOneAndUpdate({Nombre_Material, Marca, Gramaje, Tipo, Ancho_Resma, Alto_Resma, Espesor_Resma, Fibra, Precio_x_Kilo, Color})
    res.json({"Message": "Material actualizado " + material.Nombre})
}
materialControl.deleteMaterial = async (req, res)=> {
    const material =  await materials.esquema.findByIdAndDelete(req.params.id);
    res.json({"Message": "Material eliminado"});
}

  module.exports = materialControl