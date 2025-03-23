import React from "react";
import NewRadialBar from "./NewRadialBar";
import ErrorMessaage from "../../ErrorMessage/ErrorMessage";
import { Box } from "@mui/material";
import SimpleRadarChart from "./SimpleRadarChart";

const JobsPerSeller = (props) => {
  // Calcular la cantidad de trabajos por cliente.
  // Recibe la lista de trabajos en props.jobs
  // Se accede a la propiedad company en props.jobs.company
  const [useRank, setRank] = React.useState(10);

  let customers = {};

  try {
    for (let job of props.jobs) {
      if (customers[job.Owner._id]) {
        customers[job.Owner._id].qJobs >= 1
          ? (customers[job.Owner._id].qJobs += 1)
          : (customers[job.Owner._id].qJobs = 1);
      } else
        customers[job.Owner._id] = {
          qJobs: 1,
          name: `${job.Owner.Name} ${job.Owner.LastName}`,
        };
    }

    const topCustomers = Object.values(customers)
      .sort((a, b) => a.qJobs - b.qJobs)
      .slice(-useRank);

    return (
      <SimpleRadarChart
        data={topCustomers}
        dataKey={{ cat: "name", qty: "qJobs" }}
        title="Trabajos por vendedor"
      />
    );
  } catch (error) {
    return (
      <Box>
        <ErrorMessaage
          message={"Hubo un error al cargar la informacion"}
          severity={"error"}
          action={() => alert(error.message)}
        />
      </Box>
    );
  }
};

export default JobsPerSeller;
