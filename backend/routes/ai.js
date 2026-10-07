// routes/ai.js
const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const { extraerDatosPedido } = require("../services/aiExtractor");
const { buildJobDocument } = require("../services/jobBuilder");

// ⚠️ CONFIRMÁ ESTE PATH Y EXPORT. Tiene que ser el modelo de MATERIALES/papeles
// (el schema con Nombre_Material, Gramaje, Tipo...). En el proyecto, el export era:
//     module.exports.esquema = model("Material", materialSchema);
// Si el archivo real NO es "materiales.js", ajustá el require.
const MaterialModel = require("../models/materiales").esquema;

router.post("/job-draft", async (req, res, next) => {
  try {
    const { prompt, companyId, ownerId, tenantId } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "El parámetro 'prompt' es requerido." });
    }

    // 1. Extraer datos del pedido con IA
    const extractedData = await extraerDatosPedido(prompt);

    // 2. Traer papeles activos del tenant.
    //    tenantId viene como STRING del body -> convertir a ObjectId para que el
    //    filtro matchee (si el campo en la base es ObjectId).
    const tenantRaw = tenantId || req.user?.tenant;
    let tenantObjectId = tenantRaw;
    let tenantQuery = tenantRaw;
    try {
      if (tenantRaw && mongoose.isValidObjectId(tenantRaw)) {
        tenantQuery = new mongoose.Types.ObjectId(tenantRaw);
      }
    } catch (_) {}

    const filtro = { status: "activo", ...(tenantQuery && { tenant: tenantQuery }) };
    const catalogoMateriales = await MaterialModel.find(filtro).lean();

    // --- LOGS DE DIAGNÓSTICO (sacar cuando ande) ---
    console.log("[job-draft] modelName:", MaterialModel.modelName, "| collection:", MaterialModel.collection.name);
    console.log("[job-draft] total sin filtro:", await MaterialModel.countDocuments());
    console.log("[job-draft] activos (sin tenant):", await MaterialModel.countDocuments({ status: "activo" }));
    console.log("[job-draft] catalogoMateriales.length:", catalogoMateriales.length);
    console.log("[job-draft] tenant recibido:", tenantRaw, "| usado como:", typeof tenantQuery === "object" ? "ObjectId" : typeof tenantQuery);
    // ------------------------------------------------

    // 3. Ensamblar el borrador del Job
    const { jobPayload, avisos } = await buildJobDocument({
      extractedData,
      catalogoMateriales,
      companyObjectId: companyId || req.user?.companyId,
      ownerObjectId: ownerId || req.user?._id,
      tenantObjectId,
    });

    return res.json({ success: true, data: jobPayload, avisos });
  } catch (error) {
    next(error);
  }
});

module.exports = router;