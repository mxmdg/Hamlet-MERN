const { Router } = require('express');
const routerFormat = Router();
const path = require('path');
const { getFormats , addFormat, getFormat, updateFormat, deleteFormat } = require('./controllers/formatControl')

routerFormat.route('/')
.get(getFormats)
.post(addFormat);

routerFormat.route('/:id')
.put(updateFormat)
.get(getFormat)
.delete(deleteFormat)

module.exports = routerFormat;