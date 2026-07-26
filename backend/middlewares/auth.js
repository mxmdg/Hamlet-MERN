const jwt = require("jsonwebtoken");
const Membership = require("../models/memberships");

/*
 * Estas tres funciones vivían dentro de app.js.
 * Se movieron acá SIN cambiar su lógica, para que routes/index.js
 * (y cualquier otro archivo) puedan importarlas.
 *
 * Nota técnica: siguen usando req.app.get("secretKey"). Eso funciona
 * igual que antes porque Express inyecta req.app en cada request,
 * exista este código en app.js o en cualquier otro módulo.
 */

const normalizeRole = (roleValue) =>
  typeof roleValue === "string" ? roleValue.toLowerCase() : "";

const getGlobalRoleFromPayload = (payload) =>
  normalizeRole(payload?.Role || payload?.role);

// Verifica que haya un token válido (sin chequear rol).
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, req.app.get("secretKey"), (error, payload) => {
      if (error) {
        res.json(error);
      } else {
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Necesita un token de seguridad" });
  }
};

// Middleware para filtrar por rol global (del token).
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
      const userRole = getGlobalRoleFromPayload(payload);
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

// Middleware para filtrar por rol según método HTTP (por tenant/membresía).
function requireRoleByMethod(rolesByMethod) {
  return async function (req, res, next) {
    try {
      const method = req.method.toLowerCase();
      const allowedRoles = rolesByMethod[method];

      if (!allowedRoles || allowedRoles === "public") return next();

      const authHeader = req.headers["authorization"];
      if (!authHeader)
        return res.status(401).json({ message: "Token requerido" });

      const token = authHeader.split(" ")[1];

      jwt.verify(token, req.app.get("secretKey"), async (error, payload) => {
        if (error) return res.status(403).json({ message: "Token inválido" });

        const globalRole = getGlobalRoleFromPayload(payload);
        const allowed = Array.isArray(allowedRoles)
          ? allowedRoles.map((r) => r.toLowerCase())
          : [allowedRoles.toLowerCase()];

        // 👑 1. SI ES MASTER: Bypass total (No necesita membresía ni tenant)
        if (globalRole === "master") {
          req.user = payload;
          req.role = "master";
          req.membership = {
            role: "master",
            status: "activo",
            tenant: req.header("x-tenant"),
          };
          return next();
        }

        // 🏢 2. VALIDACIÓN PARA MORTALES (Admin, Manager, etc.)
        if (!req.tenant) {
          return res
            .status(400)
            .json({ message: "Tenant no resuelto (Falta x-tenant header)." });
        }

        const membership = await Membership.findOne({
          userId: payload.userId,
          tenant: req.tenant._id,
          status: "activo",
        }).populate("tenant");

        if (!membership) {
          return res.status(403).json({
            message: "No tienes una membresía activa en esta imprenta.",
          });
        }

        // 3. BLOQUEO POR IMPRENTA INACTIVA
        if (membership.tenant && membership.tenant.status === "inactivo") {
          return res.status(402).json({
            message:
              "El acceso a esta imprenta está suspendido por falta de pago.",
          });
        }

        const userRole = membership.role.toLowerCase();

        // 4. VERIFICAR SI EL ROL DE LA MEMBRESÍA ESTÁ PERMITIDO
        if (!allowed.includes(userRole)) {
          return res
            .status(403)
            .json({ message: "Tu rol no te permite realizar esta acción." });
        }

        // Éxito: Seteamos el contexto
        req.user = payload;
        req.membership = membership;
        req.role = userRole;

        next();
      });
    } catch (e) {
      next(e);
    }
  };
}

module.exports = {
  verifyToken,
  requireRole,
  requireRoleByMethod,
  normalizeRole,
  getGlobalRoleFromPayload,
};
