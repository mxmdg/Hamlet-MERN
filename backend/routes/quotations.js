const { Router } = require('express');
const routerQuotation = Router();
const path = require('path');
const {
  getQuotations,
  addQuotation,
  getQuotation,
  updateQuotation,
  deleteQuotation,
  //getQuotationsResumen
} = require('./controllers/quotationsControl');

// Rutas principales
routerQuotation.route('/')
  .get(getQuotations)
  .post(addQuotation);
  

/* routerQuotation.route('/resumen')
.get(getQuotationsResumen); */


routerQuotation.route('/:id')
  .get(getQuotation)
  .put(updateQuotation)
  .patch(updateQuotation)
  .delete(deleteQuotation)


module.exports = routerQuotation;