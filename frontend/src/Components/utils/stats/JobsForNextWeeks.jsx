import React from "react";
import NewStackedBarChart from "./NewStackedBarChart";
import JobTypes from "../../Jobs/JobTypes";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const JobsForNextDays = (props) => {
  const [useError, setError] = React.useState(false);

  const getMyDate = (event) => {
    const dd = new Date(event).getUTCDate();
    const mm = new Date(event).getUTCMonth();
    const yy = new Date(event).getFullYear();
    const MiDate = `${dd}/${mm + 1}/${yy}`;
    return MiDate;
  };

  let outDate = {};

  const jobsPerOutDate = Object.values(outDate).sort((a, b) => {
    const dateA = new Date(a.name.split("/").reverse().join("-")).getTime();
    const dateB = new Date(b.name.split("/").reverse().join("-")).getTime();
    return dateA - dateB;
  });

  const dataKeys = [];

  for (let type of JobTypes) {
    dataKeys.push(type.name);
  }

  React.useEffect(() => {
    try {
      for (let job of props.jobs) {
        const Salida = getMyDate(job.Entrega);
        const yesterday = new Date();
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 60); // next 30 days
        yesterday.setDate(today.getDate() - 1); //Ayer

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
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  }, [useError]);

  return !useError ? (
    <NewStackedBarChart data={jobsPerOutDate} dataKey={dataKeys} />
  ) : (
    <ErrorMessage message={useError} />
  );
};

export default JobsForNextDays;
