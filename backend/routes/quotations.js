const { Router } = require('express');
const routerQuotation = Router();
const path = require('path');
const {
  getQuotations,
  addQuotation,
  getQuotation,
  updateQuotation,
  deleteQuotation,
} = require('./controllers/quotationsControl');

// Rutas principales
routerQuotation.route('/')
  .get(getQuotations)
  .post(addQuotation);

routerQuotation.route('/:id')
  .get(getQuotation)
  .put(updateQuotation)
  .delete(deleteQuotation);

module.exports = routerQuotation;