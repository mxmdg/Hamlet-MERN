require("./dbConnection"); // Importa la conexión existente
const mongoose = require("mongoose");
const Job = require("./models/Job").esquema;

async function updateFinishingFields() {
  try {
    // Filtrar trabajos donde Finishing no es un array de ObjectId aún
    const jobsToUpdate = await Job.find(
      { Finishing: { $exists: true, $ne: [] } }, // Solo los que tienen Finishing con valores
      { Finishing: 1 } // Solo traer el campo Finishing para optimizar memoria
    );

    if (jobsToUpdate.length === 0) {
      console.log("No hay trabajos que necesiten actualización.");
      return;
    }

    console.log(`Se encontraron ${jobsToUpdate.length} trabajos para actualizar.`);

    // Preparamos los updates
    const bulkOps = jobsToUpdate.map((job) => ({
      updateOne: {
        filter: { _id: job._id },
        update: {
          $set: { Finishing: job.Finishing.map((finish) => finish._id || finish) },
        },
      },
    }));

    // Ejecutamos la actualización masiva
    const result = await Job.bulkWrite(bulkOps);
    console.log(`Actualizados: ${result.modifiedCount} trabajos`);

  } catch (error) {
    console.error("Error en la actualización:", error);
  } finally {
    mongoose.connection.close();
  }
}

updateFinishingFields();
