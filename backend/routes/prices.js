const { Router } = require('express');
const routerPrice = Router();
const path = require('path');
const { getPrices , addPrice, getPrice, updatePrice, deletePrice } = require('./controllers/pricesControl')

routerPrice.route('/')
.get(getPrices)
.post(addPrice);

routerPrice.route('/:id')
.put(updatePrice)
.get(getPrice)
.delete(deletePrice)

module.exports = routerPrice;