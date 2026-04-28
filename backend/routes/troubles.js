const { Router } = require("express");
const routerTroubles = Router();
const path = require("path");
const {
  getTroubles,
  getTrouble,
  getTroubleBySource,
  getDeletedTroubles,
  addTrouble,
  updateTrouble,
  deleteTrouble,
} = require("./controllers/troubleControl");

routerTroubles.route("/").get(getTroubles).post(addTrouble);

routerTroubles.route("/trash").get(getDeletedTroubles);

routerTroubles
  .route("/:id")
  .get(getTrouble)
  .put(updateTrouble)
  .delete(deleteTrouble);

routerTroubles
  .route("/belongsTo/:sourceType/:sourceId")
  .get(getTroubleBySource);

routerTroubles.route("/trash/:id").delete(updateTrouble);

module.exports = routerTroubles;
