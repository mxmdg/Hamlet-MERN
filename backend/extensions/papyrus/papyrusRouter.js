const { Router } = require("express");
const routerPapyrus = Router();
const { runQuery } = require("./papyrusControl");

/*
 * Una sola puerta de entrada para TODAS las queries de Papyrus.
 * El frontend manda { query: "nombre", params: {...} }.
 * Qué queries existen y qué params aceptan se define en papyrusQueries.js.
 */
routerPapyrus.route("/query").post(runQuery);

module.exports = routerPapyrus;
