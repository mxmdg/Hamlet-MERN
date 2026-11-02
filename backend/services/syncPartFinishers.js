// services/syncPartFinishers.js
const Finishers = require("../models/finishers").esquema;

/**
 * Asegura que el Type de la parte esté habilitado exactamente en las
 * terminaciones indicadas (dentro del tenant) y deshabilitado en el resto.
 */
async function syncPartFinishers({ tenant, partType, finisherIds = [] }) {
  // 1) Habilitar en las seleccionadas
  await Finishers.updateMany(
    { tenant, _id: { $in: finisherIds } },
    { $addToSet: { partTypesAllowed: partType } }
  );

  // 2) Quitar de las que ya no están seleccionadas
  await Finishers.updateMany(
    { tenant, _id: { $nin: finisherIds }, partTypesAllowed: partType },
    { $pull: { partTypesAllowed: partType } }
  );
}

module.exports = { syncPartFinishers };