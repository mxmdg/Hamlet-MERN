const materials = require("../../models/materiales");
const prices = require("../../models/prices");

const materialControl = {};

materialControl.getMaterials = async (req, res) => {
  {
    const material = await materials.esquema.find();
    //.populate({ path: "Precio_x_Kilo", model: prices.esquema });

    res.json(material);
  }
};

materialControl.addMaterial = async (req, res) => {
  {
    try {
      const {
        Nombre_Material,
        Marca,
        Gramaje,
        Tipo,
        Ancho_Resma,
        Alto_Resma,
        Espesor_Resma,
        Fibra,
        Precio_x_Kilo,
        Color,
      } = req.body;
      const newMaterial = new materials.esquema({
        Nombre_Material,
        Marca,
        Gramaje,
        Tipo,
        Ancho_Resma,
        Alto_Resma,
        Espesor_Resma,
        Fibra,
        Precio_x_Kilo,
        Color,
      });
      await newMaterial.save();
      res.json({ message: newMaterial.Nombre + " guardado OK" });
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: e });
    }
  }
};

materialControl.getMaterial = async (req, res) => {
  try {
    const material = await materials.esquema.findById(req.params.id);
    //.populate({ path: "Precio_x_Kilo", model: prices.esquema });
    if (material) {
      res.json(material);
    } else {
      res.status(404).json({ message: "Material no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el Material" });
  }
};

materialControl.updateMaterial = async (req, res) => {
  try {
    const {
      Nombre_Material,
      Marca,
      Gramaje,
      Tipo,
      Ancho_Resma,
      Alto_Resma,
      Espesor_Resma,
      Fibra,
      Precio_x_Kilo,
      Color,
    } = req.body;
    const material = await materials.esquema.findOneAndUpdate(
      { _id: req.params.id },
      {
        Nombre_Material,
        Marca,
        Gramaje,
        Tipo,
        Ancho_Resma,
        Alto_Resma,
        Espesor_Resma,
        Fibra,
        Precio_x_Kilo,
        Color,
      }
    );
    res.json({ Message: "Material actualizado " + material.Nombre });
  } catch (error) {
    console.log("Error: " + error);
    res.status(404).json({ error });
  }
};
materialControl.deleteMaterial = async (req, res) => {
  const material = await materials.esquema.findByIdAndDelete(req.params.id);
  res.json({ Message: "Material eliminado" });
};

module.exports = materialControl;
