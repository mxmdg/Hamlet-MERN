const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const Membership = require("./models/memberships");
const apiBCRA = require("./services/api_bcra");

//settings
app.set("port", process.env.PORT || 5000);
app.set("secretKey", "hamlet");

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

/* Add: simple tenant resolver from x-tenant header so requireRoleByMethod and handlers have req.tenant */
app.use((req, res, next) => {
  const tenantHeader = req.header("x-tenant");
  if (tenantHeader) {
    req.tenant = { _id: tenantHeader };
  }
  next();
});

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
  return async function (req, res, next) {
    try {
      const method = req.method.toLowerCase();
      const allowedRoles = rolesByMethod[method];

      // Método no protegido
      if (!allowedRoles || allowedRoles === "public") {
        return next();
      }

      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(401).json({ message: "Token requerido" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token inválido" });
      }

      jwt.verify(token, req.app.get("secretKey"), async (error, payload) => {
        if (error) {
          return res.status(403).json({ message: "Token inválido" });
        }

        // ⛔ tenant DEBE venir de resolveTenant
        if (!req.tenant) {
          return res.status(400).json({
            message: "Tenant no resuelto. Falta middleware resolveTenant",
          });
        }

        const membership = await Membership.findOne({
          userId: payload.userId,
          tenant: req.tenant._id,
          status: "activo",
        });

        if (!membership) {
          return res.status(403).json({
            message: "Tu membresía no esta activa para esta imprenta",
          });
        }

        const userRole = membership.role.toLowerCase();
        const allowed = Array.isArray(allowedRoles)
          ? allowedRoles.map((r) => r.toLowerCase())
          : [allowedRoles.toLowerCase()];

        if (!allowed.includes(userRole)) {
          return res.status(403).json({
            message: "Tu rol no te permite realizar esta acción",
          });
        }

        // ✅ contexto consistente en toda la app
        req.user = payload; // { userId, exp, iat, ... }
        req.membership = membership; // rol + tenant
        req.role = userRole; // shortcut útil

        next();
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

// routes

app.get("/health", async (req, res) => {
  try {
    // chequeos mínimos
    // await mongoose.connection.db.admin().ping();
    console.log("Health check OK " + new Date().toISOString());

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
  //(req, res, next) => req.app.verifyToken(req, res, next),
  requireRoleByMethod({
    get: ["admin", "manager", "vendedor", "customer"], // todos pueden hacer GET
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
app.use(
  "/Hamlet/users",
  requireRoleByMethod({
    get: ["admin", "manager"], // todos pueden hacer GET
    post: "public", // todos pueden hacer GET
    put: "public",
    delete: ["admin", "manager"],
  }),
  require("./routes/users")
);
app.use(
  "/Hamlet/quotations",
  requireRoleByMethod({
    get: ["admin", "manager", "operador"],
    post: ["admin", "manager"],
    put: ["admin", "manager"],
    delete: ["admin", "manager"],
  }),
  require("./routes/quotations")
);

app.use(
  "/Hamlet/tenants",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
    post: "public", // todos pueden hacer GET
    put: "admin", // todos pueden hacer GET
    delete: "admin", // todos pueden hacer GET
  }),
  require("./routes/tenants")
);

app.use(
  "/Hamlet/tenants/settings",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
    put: "admin", // solo admin puede hacer PUT
  }),
  require("./routes/tenants")
);

app.use(
  "/Hamlet/memberships",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
    post: ["admin", "manager"], // todos pueden hacer GET
    put: ["admin", "manager"], // todos pueden hacer GET
    delete: ["admin", "manager"], // todos pueden hacer GET
  }),
  require("./routes/memberships")
);

app.use(
  "/apibcra",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
  }),
  apiBCRA.getCotization
);

app.use(
  "/apibcra-date",
  requireRoleByMethod({
    get: "public", // todos pueden hacer GET
  }),
  apiBCRA.getCotizationPerDate
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
