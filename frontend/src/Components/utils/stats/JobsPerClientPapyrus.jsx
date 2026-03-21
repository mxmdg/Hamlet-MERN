import React from "react";
import SimpleRadarChart from "./SimpleRadarChart";

const JobsPerClientPapyrus = (props) => {
  // En SQL la propiedad es simplemente job.Cliente (string)
  const [useRank] = React.useState(props.rank || 10);

  let customers = {};

  try {
    if (props.jobs) {
      for (let job of props.jobs) {
        // Usamos el string directamente como llave
        const nombreCliente = job.Cliente || "Sin Cliente";

        if (customers[nombreCliente]) {
          customers[nombreCliente].qJobs += 1;
        } else {
          customers[nombreCliente] = {
            name: nombreCliente,
            qJobs: 1,
          };
        }
      }
    }
  } catch (error) {
    // Usamos la función setError pasada por StatsCollector
    if (props.setError) props.setError(error);
  }

  // Ordenar de mayor a menor y tomar el top según el rank
  const topCustomers = Object.values(customers)
    .sort((a, b) => b.qJobs - a.qJobs) // De mayor a menor
    .slice(0, useRank);

  return (
    <SimpleRadarChart
      data={topCustomers}
      dataKey={{ cat: "name", qty: "qJobs" }}
      rank={useRank}
      title={props.title || "Top Clientes (Papyrus)"}
    />
  );
};

export default JobsPerClientPapyrus;
