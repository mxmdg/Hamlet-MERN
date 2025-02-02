import React from "react";
import NewRadialBar from "./NewRadialBar";

const JobsPerClient = (props) => {
  // Calcular la cantidad de trabajos por cliente.
  // Recibe la lista de trabajos en props.jobs
  // Se accede a la propiedad company en props.jobs.company
  const [useRank, setRank] = React.useState(props.rank);

  let customers = {};

  for (let job of props.jobs) {
    if (customers[job.Company._id]) {
      customers[job.Company._id].qJobs >= 1
        ? (customers[job.Company._id].qJobs += 1)
        : (customers[job.Company._id].qJobs = 1);
    } else customers[job.Company._id] = { qJobs: 1, name: job.Company.Nombre };
  }

  const topCustomers = Object.values(customers)
    .sort((a, b) => a.qJobs - b.qJobs)
    .slice(-useRank);

  return <NewRadialBar data={topCustomers} dataKey="qJobs" rank={props.rank} />;
};

export default JobsPerClient;
