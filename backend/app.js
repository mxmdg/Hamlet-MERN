const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const uuid = require("uuid");

//settings
app.set("port", process.env.PORT || 5000);
app.set("secretKey", "hamlet");

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    //console.log(token);
    jwt.verify(token, req.app.get("secretKey"), (error, payload) => {
      if (error) {
        res.json(error);
      } else {
        //console.log(payload);
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Necesita un token de seguridad" });
  }
};

app.verifyToken = verifyToken;

// Middleware para filtrar por rol
function requireRole(role) {
  return function (req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Token requerido" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, req.app.get("secretKey"), (error, payload) => {
      if (error) {
        return res.status(403).json({ message: "Token inválido" });
      }
      // Normalizar a minúsculas para comparar
      const userRole = (payload.role || "").toLowerCase();
      if (
        !userRole ||
        (Array.isArray(role)
          ? !role.map((r) => r.toLowerCase()).includes(userRole)
          : userRole !== role.toLowerCase())
      ) {
        return res
          .status(403)
          .json({ message: "Acceso denegado: rol no admitido" });
      }
      req.user = payload;
      next();
    });
  };
}

// Middleware para filtrar por rol según método HTTP
function requireRoleByMethod(rolesByMethod) {
  return function (req, res, next) {
    const method = req.method.toLowerCase();
    const allowedRoles = rolesByMethod[method];
    if (!allowedRoles) return next(); // Si no se define, permitir acceso

    // Si GET es público
    if (allowedRoles === "public") return next();

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Token requerido" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, req.app.get("secretKey"), (error, payload) => {
      if (error) {
        return res.status(403).json({ message: "Token inválido" });
      }
      const userRole = (payload.role || "").toLowerCase();
      const allowed = Array.isArray(allowedRoles)
        ? allowedRoles.map((r) => r.toLowerCase())
        : [allowedRoles.toLowerCase()];
      if (!userRole || !allowed.includes(userRole)) {
        return res.status(403).json({
          message: "Acceso denegado, no tiene permiso para esta acción",
        });
      }
      req.user = payload;
      next();
    });
  };
}

// routes

app.get("/health", async (req, res) => {
  try {
    // chequeos mínimos
    // await mongoose.connection.db.admin().ping();
    console.log("Health check OK");

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

app.get("/", (rej, res) => {
  res.send("Welcome to node.js server");
});
app.use(
  "/Hamlet/jobs",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
    post: "public",
    put: "public",
    delete: ["admin", "manager", "vendedor"],
  }),
  require("./routes/jobs")
);
app.use(
  "/Hamlet/jobs/urg",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
    post: ["admin", "manager", "vendedor", "customer"],
    put: ["admin", "manager", "vendedor"],
    delete: ["admin", "manager", "vendedor"],
  }),
  require("./routes/jobs")
);
app.use(
  "/Hamlet/Impresoras",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./routes/printers")
);

app.use(
  "/Hamlet/Impresoras/simple",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./routes/printers")
);
app.use(
  "/Hamlet/finishers",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./routes/finishers")
);
app.use(
  "/Hamlet/formatos",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
    post: ["admin", "manager", "vendedor"],
    put: ["admin", "manager", "vendedor"],
    delete: ["admin", "manager"],
  }),
  require("./routes/formatos")
);
app.use(
  "/Hamlet/empresas",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
    post: ["admin", "manager", "vendedor"],
    put: ["admin", "manager", "vendedor"],
    delete: ["admin", "manager", "vendedor"],
  }),
  require("./routes/empresas")
);
app.use(
  "/Hamlet/precios",
  (req, res, next) => req.app.verifyToken(req, res, next),
  requireRoleByMethod({
    get: ["admin", "manager"], // todos pueden hacer GET
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }), // Solo admin puede acceder
  require("./routes/prices")
);
app.use("/Hamlet/JobParts", require("./routes/jobParts"));
app.use(
  "/Hamlet/materiales",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./routes/materiales")
);
app.use("/Hamlet/users", require("./routes/users"));
app.use(
  "/Hamlet/quotations",
  requireRoleByMethod({
    get: ["admin", "manager", "vendedor"],
    post: ["admin", "manager", "vendedor"],
    put: ["admin", "manager", "vendedor"],
    delete: ["admin", "manager"],
  }),
  require("./routes/quotations")
);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
