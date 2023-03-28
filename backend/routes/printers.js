const { Router } = require('express');
const routerPrinter = Router();
const fsExtra = require('fs-extra');
const path = require('path');

const { getPrinters , addPrinter, getPrinter, updatePrinter, deletePrinter } = require('./controllers/printerControl')

routerPrinter.route('/')
.get(getPrinters)
.post(addPrinter);

routerPrinter.route('/:id')
.put(updatePrinter)
.get(getPrinter)
.delete(deletePrinter)

module.exports = routerPrinter;
