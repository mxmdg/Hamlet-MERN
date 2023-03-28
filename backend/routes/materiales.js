const { Router } = require('express');
const routerMaterial = Router();
const path = require('path');
const material = require('../models/materiales')

const { getMaterials , addMaterial, getMaterial, updateMaterial, deleteMaterial } = require('./controllers/materialControl')

routerMaterial.route('/')
.get(getMaterials)
.post(addMaterial);

routerMaterial.route('/:id')
.put(updateMaterial)
.get(getMaterial)
.delete(deleteMaterial)

module.exports = routerMaterial;