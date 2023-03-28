const { Router } = require('express');
const routerJob = Router();
const fsExtra = require('fs-extra');
const path = require('path');
const { getJobs , addJob, getJob, updateJob, deleteJob } = require('./controllers/jobControl')

routerJob.route('/')
.get(getJobs)
.post(addJob);

routerJob.route('/:id')
.put(updateJob)
.get(getJob)
.delete(deleteJob)

module.exports = routerJob;