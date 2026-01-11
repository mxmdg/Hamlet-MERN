const { Router } = require("express");
const routerPrice = Router();
const path = require("path");
const {
  getPrices,
  addPrice,
  getPrice,
  updatePrice,
  deletePrice,
  getDeletedPrices,
  updateStatus,
} = require("./controllers/pricesControl");

routerPrice.route("/").get(getPrices).post(addPrice);

routerPrice.route("/trash").get(getDeletedPrices);

routerPrice.route("/:id").put(updatePrice).get(getPrice).delete(deletePrice);

routerPrice.route("/trash/:id").delete(updateStatus);

module.exports = routerPrice;
