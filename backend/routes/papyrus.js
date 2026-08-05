const { Router } = require("express");
const routerPapyrus = Router();
const { getJobDetail, getCustomers } = require("./controllers/papyrusControl");

// El frontend manda { ot: 27703 } en el body. Nada de SQL.
routerPapyrus.route("/job").post(getJobDetail);
routerPapyrus.route("/customers").post(getCustomers)

module.exports = routerPapyrus;
