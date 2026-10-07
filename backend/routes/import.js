// routes/import.js
const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const { extraerDatosPedido } = require("../services/aiExtractor");
const { buildJobDocument } = require("../services/jobBuilder");

// Mismo modelo que usa el resto de Hamlet. No tocar el modelo; sólo usarlo.
const MaterialModel = require("../models/materiales").esquema;

router.post("/test", async (req, res, next) => {
  try {
    const { textoLibre } = req.body;
    if (!textoLibre) {
      return res.status(400).json({ error: "El campo 'textoLibre' es requerido." });
    }

    // --- Resolver el tenant ---
    // La ruta /Hamlet/import está como "public", así que el middleware NO pobló
    // req.tenant. El tenant viene en el header 'x-tenant'. Lo leemos de ahí (o de
    // req.tenant si algún día la ruta deja de ser pública) y lo pasamos a ObjectId.
    const tenantRaw =
      (req.tenant && req.tenant._id) ||
      req.headers["x-tenant"] ||
      req.body.tenantId ||
      null;

    let tenantQuery = null;
    if (tenantRaw && mongoose.isValidObjectId(tenantRaw)) {
      tenantQuery = new mongoose.Types.ObjectId(tenantRaw);
    } else if (tenantRaw) {
      tenantQuery = tenantRaw; // por si en la base el tenant fuera string
    }

    // 1. Extraer datos con la IA
    const extractedData = await extraerDatosPedido(textoLibre);

    // 2. Catálogo de materiales activos del tenant
    const filtro = { status: "activo", ...(tenantQuery && { tenant: tenantQuery }) };
    const catalogoMateriales = await MaterialModel.find(filtro).lean();

    // --- LOGS DE DIAGNÓSTICO (borrar cuando ande) ---
    console.log("[import/test] collection:", MaterialModel.collection.name);
    console.log("[import/test] total sin filtro:", await MaterialModel.countDocuments());
    console.log("[import/test] activos sin tenant:", await MaterialModel.countDocuments({ status: "activo" }));
    console.log("[import/test] tenantRaw:", tenantRaw, "| tipo usado:", typeof tenantQuery === "object" ? "ObjectId" : typeof tenantQuery);
    console.log("[import/test] catalogoMateriales.length:", catalogoMateriales.length);
    // -------------------------------------------------

    const mockCompanyId = "60d5ecb8b5c9c22b1c8e4001"; // TODO: resolver cliente real
    const mockOwnerId = req.user ? req.user._id : "60d5ecb8b5c9c22b1c8e4002";

    // 3. Ensamblar borrador del Job
    const result = await buildJobDocument({
      extractedData,
      catalogoMateriales,
      companyObjectId: mockCompanyId,
      ownerObjectId: mockOwnerId,
      tenantObjectId: tenantQuery || tenantRaw,
    });

    res.json({
      status: "success",
      borradorJob: result.jobPayload,
      avisos: result.avisos,
      datosExtraidosIA: extractedData,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;