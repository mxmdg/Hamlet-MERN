const { Router } = require("express");
const router = Router();

// Las funciones de auth ahora viven en middlewares/auth.js
const { requireRoleByMethod } = require("../middlewares/auth");

// Middlewares/handlers que se montan como ruta
const apiBCRA = require("../services/api_bcra");
const ApoXMLExporter = require("../middlewares/flatWorkApoXMLExporter");

/*
 * Router maestro. Este archivo es la TABLA CENTRAL DE PERMISOS:
 * de un vistazo se ve quién puede hacer qué en cada ruta.
 *
 * Se movió tal cual desde app.js. Los permisos son IDÉNTICOS a los
 * que había antes: esto es reordenamiento, no cambio de comportamiento.
 * Para ajustar quién accede a cada ruta, se edita acá.
 */

router.post("/Hamlet/SendToApogee", ApoXMLExporter);

router.use(
  "/Hamlet/jobs",
  requireRoleByMethod({
    get: ["admin", "manager", "operator"],
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager", "vendedor"],
  }),
  require("./jobs"),
);

router.use(
  "/Hamlet/jobs/urg",
  requireRoleByMethod({
    get: ["admin", "manager", "operator"],
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./jobs"),
);

router.use(
  "/Hamlet/papyrus",
  requireRoleByMethod({
    post: ["admin", "manager", "operator"],
  }),
  require("./papyrus"),
);

router.use(
  "/Hamlet/Impresoras",
  requireRoleByMethod({
    get: "public",
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./printers"),
);

router.use(
  "/Hamlet/Impresoras/simple",
  requireRoleByMethod({
    get: "public",
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./printers"),
);

router.use(
  "/Hamlet/finishers",
  requireRoleByMethod({
    get: "public",
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./finishers"),
);

router.use(
  "/Hamlet/formatos",
  requireRoleByMethod({
    get: "public",
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./formatos"),
);

router.use(
  "/Hamlet/empresas",
  requireRoleByMethod({
    get: "public",
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./empresas"),
);

router.use(
  "/Hamlet/precios",
  requireRoleByMethod({
    get: ["admin", "manager"],
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./prices"),
);

router.use("/Hamlet/JobParts", require("./jobParts"));

router.use(
  "/Hamlet/materiales",
  requireRoleByMethod({
    get: "public",
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./materiales"),
);

router.use(
  "/Hamlet/users",
  requireRoleByMethod({
    get: ["admin", "manager"],
    post: "public",
    put: "public",
    delete: ["admin", "manager"],
  }),
  require("./users"),
);

router.use(
  "/Hamlet/quotations",
  requireRoleByMethod({
    get: ["admin", "manager"],
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./quotations"),
);

router.use(
  "/Hamlet/settings",
  requireRoleByMethod({
    get: "public",
    put: "admin",
  }),
  require("./settings"),
);

router.use(
  "/Hamlet/tenants",
  requireRoleByMethod({
    get: "public",
    post: "public",
    put: "master",
    delete: "master",
  }),
  require("./tenants"),
);

router.use(
  "/Hamlet/memberships",
  requireRoleByMethod({
    get: "public",
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./memberships"),
);

router.use(
  "/Hamlet/troubles",
  requireRoleByMethod({
    get: "public",
    post: ["admin", "manager", "operator"],
    put: ["admin", "manager", "operator"],
    delete: ["admin", "manager", "operator"],
  }),
  require("./troubles"),
);

router.use(
  "/apibcra",
  requireRoleByMethod({
    get: "public",
  }),
  apiBCRA.getCotization,
);

router.use(
  "/apibcra-date",
  requireRoleByMethod({
    get: "public",
  }),
  apiBCRA.getCotizationPerDate,
);

module.exports = router;
