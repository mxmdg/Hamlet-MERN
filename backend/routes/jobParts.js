const { Router } = require('express');
const routerJobPart = Router();
const path = require('path');
const jobPart = require('../models/jobParts')

const { getJobParts , addJobPart , getJobPart , updateJobPart , deleteJobPart } = require('./controllers/jobPartControl')

routerJobPart.route('/')
.get(getJobParts)
.post(addJobPart);

routerJobPart.route('/:id')
.put(updateJobPart)
.get(getJobPart)
.delete(deleteJobPart)

module.exports = routerJobPart;