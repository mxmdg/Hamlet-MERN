import React from "react";
import NewStackedBarChart from "./NewStackedBarChart";
import JobTypes from "../../Jobs/JobTypes";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const JobsForNextDays = (props) => {
  const [useError, setError] = React.useState(null);
  const [from, setFrom] =React.useState(null);

  const getMyDate = (event) => {
    const dd = new Date(event).getUTCDate();
    const mm = new Date(event).getUTCMonth();
    const yy = new Date(event).getFullYear();
    const MiDate = `${dd}/${mm + 1}/${yy}`;
    return MiDate;
  };

  let outDate = {};

  for (let job of props.jobs) {
    const Salida = getMyDate(job.Entrega);
    const yesterday = new Date();
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 60); // next 30 days
    yesterday.setDate(today.getDate() - 1); //Ayer

    try {
      if (
        new Date(job.Entrega) >= yesterday &&
        new Date(job.Entrega) <= endDate
      ) {
        if (outDate[Salida]) {
          outDate[Salida][job.Tipo[0].name] >= 1
            ? (outDate[Salida][job.Tipo[0].name] += job.Cantidad)
            : (outDate[Salida][job.Tipo[0].name] = job.Cantidad);
        } else
          outDate[Salida] = {
            [job.Tipo[0].name]: job.Cantidad,
            name: `${Salida}`,
          };
      }
    } catch (error) {
      console.log(error);
      console.log(job);
      //setError(error)
    }
  }

  const jobsPerOutDate = Object.values(outDate).sort((a, b) => {
    const dateA = new Date(a.name.split("/").reverse().join("-")).getTime();
    const dateB = new Date(b.name.split("/").reverse().join("-")).getTime();
    return dateA - dateB;
  });

  const dataKeys = [];

  for (let type of JobTypes) {
    dataKeys.push(type.name);
  }

  return useError === null ? (
    <NewStackedBarChart data={jobsPerOutDate} dataKey={dataKeys} />
  ) : (
    <ErrorMessage
      message={useError.message}
      color="warning"
      action={() => setError(null)}
    />
  );
};

export default JobsForNextDays;
