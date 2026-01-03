const { Router } = require("express");
const routerQuotation = Router();
const path = require("path");
const {
  getQuotations,
  addQuotation,
  getQuotation,
  updateQuotation,
  sendQuotationEmail,
  deleteQuotation,
  getDeletedQuotations,
  updateStatus,
  //getQuotationsResumen
} = require("./controllers/quotationsControl");

// Rutas principales
routerQuotation.route("/").get(getQuotations).post(addQuotation);
routerQuotation.route("/trash").get(getDeletedQuotations);

/* routerQuotation.route('/resumen')
.get(getQuotationsResumen); */
routerQuotation.route("/sendEmail").post(sendQuotationEmail);

routerQuotation
  .route("/:id")
  .get(getQuotation)
  .put(updateQuotation)
  .patch(updateQuotation)
  .delete(updateStatus);

routerQuotation.route("/trash/:id").delete(updateStatus);

module.exports = routerQuotation;
