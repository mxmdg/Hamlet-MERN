const express = require("express");
const app = express();
const cors = require("cors");

// Las funciones de auth se mudaron a middlewares/auth.js
const { verifyToken } = require("./middlewares/auth");
// El mapa de rutas (con sus permisos) se mudó a routes/index.js
const apiRouter = require("./routes");

// settings
app.set("port", process.env.PORT || 5000);
app.set("secretKey", "hamlet");

// middlewares base
app.use(cors({ origin: "*" }));
app.use(express.json());

/* Tenant resolver: deja req.tenant disponible para los middlewares de auth
   y para los handlers, a partir del header x-tenant. */
app.use((req, res, next) => {
  const tenantHeader = req.header("x-tenant");
  if (tenantHeader) {
    req.tenant = { _id: tenantHeader };
  }
  next();
});

// Se mantiene expuesto por compatibilidad, como estaba antes.
app.verifyToken = verifyToken;

// rutas sueltas de infraestructura
app.get("/health", async (req, res) => {
  try {
    res.status(200).json({
      status: "ok",
      timestamp: Date.now(),
    });
  } catch (err) {
    res.status(503).json({
      status: "error",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to node.js server");
});

// Todas las rutas de la aplicación (con sus permisos) viven en routes/index.js
app.use(apiRouter);

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
