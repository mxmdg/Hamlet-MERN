const { Router } = require("express");
const routerMaterial = Router();
const path = require("path");
const material = require("../models/materiales");

const {
  getMaterials,
  addMaterial,
  getMaterial,
  updateMaterial,
  deleteMaterial,
  getDeletedMaterials,
  updateStatus,
} = require("./controllers/materialControl");

routerMaterial.route("/").get(getMaterials).post(addMaterial);
routerMaterial.route("/trash").get(getDeletedMaterials);

routerMaterial
  .route("/:id")
  .put(updateMaterial)
  .get(getMaterial)
  .delete(updateStatus);

routerMaterial.route("/trash/:id").delete(updateStatus);

module.exports = routerMaterial;
