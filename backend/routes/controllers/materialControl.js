const materials = require("../../models/materiales");
const prices = require("../../models/prices");

const materialControl = {};

materialControl.getMaterials = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const material = await materials.esquema
      .find({ tenant, status: { $ne: "inactivo" } })
      .select("-__v");
    res.json(material);
  } catch (error) {
    next(error);
  }
};

materialControl.getDeletedMaterials = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const material = await materials.esquema
      .find({ tenant, status: { $eq: "inactivo" } })
      .select("-__v");

    res.json(material);
  } catch (error) {
    next(error);
  }
};

materialControl.addMaterial = async (req, res, next) => {
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
        tenant: req.header("x-tenant"),
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
      res.json({ message: newMaterial.Nombre_Material + " guardado OK" });
    } catch (e) {
      res.status(500).json({
        message:
          e.code === 11000
            ? `El nombre "${req.body.Nombre_Material}" se esta utilizando para otro material, por favor ingrese otro.`
            : "Error al crear el nuevo material.",
        code: e.code,
      });
    }
  }
};

materialControl.getMaterial = async (req, res) => {
  try {
    const tenant = req.header("x-tenant");
    const material = await materials.esquema.findOne({
      _id: req.params.id,
      tenant,
    });
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
    const tenant = req.header("x-tenant");
    const material = await materials.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
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
      },
      { new: true }
    );
    if (!material)
      return res.status(404).json({ message: "Material no encontrado" });
    res.json({ Message: "Material actualizado " + material.Nombre_Material });
  } catch (error) {
    console.log("Error: " + error);
    res.status(404).json({ error });
  }
};

materialControl.deleteMaterial = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const material = await materials.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
      { status: "inactivo" },
      { new: true }
    );
    if (!material)
      return res.status(404).json({ message: "Material no encontrado" });
    res.json({ Message: "Material desactivado", material });
  } catch (error) {
    next(error);
  }
};

materialControl.updateStatus = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const m = await materials.esquema.findOne({ _id: req.params.id, tenant });
    if (!m) return res.status(404).json({ message: "Material no encontrado" });
    m.status = m.status === "activo" ? "inactivo" : "activo";
    await m.save();
    res.json({ message: "Estado actualizado", material: m });
  } catch (error) {
    next(error);
  }
};

module.exports = materialControl;
