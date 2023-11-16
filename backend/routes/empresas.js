const { Router } = require('express');
const routerCompanies = Router();
const path = require('path');
const { getCompanies , addCompany, getCompany, updateCompany, deleteCompany } = require('./controllers/empresasControl')

routerCompanies.route('/')
.get(getCompanies)
.post(addCompany);

routerCompanies.route('/:id')
.put(updateCompany)
.get(getCompany)
.delete(deleteCompany)

module.exports = routerCompanies;