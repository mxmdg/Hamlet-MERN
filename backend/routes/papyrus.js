const { Router } = require("express");
const routerPapyrus = Router();
const { getJobDetail } = require("./controllers/papyrusControl");

// El frontend manda { ot: 27703 } en el body. Nada de SQL.
routerPapyrus.route("/job").post(getJobDetail);

module.exports = routerPapyrus;
