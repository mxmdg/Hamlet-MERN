import React from "react";
import SimpleRadarChart from "./SimpleRadarChart";
import NewRadialBar from "./NewRadialBar";

const JobsPerPartType = (props) => {
  // Calcular la cantidad de trabajos por tipo de parte.
  // Recibe la lista de trabajos en props.jobs
  // Se accede a la propiedad _id y Type en props.jobs.Partes[n].jobParts[0]._id y props.jobs.Partes[n].jobParts[0].Type
  //
  const [useRank, setRank] = React.useState(props.rank);

  // Sumar partes por nombre (Type), no por _id
  let parts = {};

  for (let job of props.jobs) {
    for (let part of job.Partes) {
      const type = part.jobParts[0]?.Type || "Parte Eliminada";
      if (parts[type]) {
        parts[type].qJobs += 1;
      } else {
        parts[type] = { qJobs: 1, name: type };
      }
    }
  }

  const topParts = Object.values(parts)
    .sort((a, b) => b.qJobs - a.qJobs)
    .slice(0, useRank);

  return (
    <SimpleRadarChart
      data={topParts}
      dataKey={{ cat: "name", qty: "qJobs" }}
      rank={props.rank}
      title={"Trabajos por Tipo de Parte"}
    />
  );
};

export default JobsPerPartType;
