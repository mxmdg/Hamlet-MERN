import React from "react";
import NewStackedBarChart from "./NewStackedBarChart";
import JobTypes from "../../Jobs/JobTypes";

const JobsForNextDays = (props) => {
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
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 10); // next 10 days

    if (new Date(job.Entrega) >= today && new Date(job.Entrega) <= endDate) {
      if (outDate[Salida]) {
        outDate[Salida][job.Tipo[0].name] >= 1
          ? (outDate[Salida][job.Tipo[0].name] += 1)
          : (outDate[Salida][job.Tipo[0].name] = 1);
      } else outDate[Salida] = { [job.Tipo[0].name]: 1, name: `${Salida}` };
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

  return <NewStackedBarChart data={jobsPerOutDate} dataKey={dataKeys} />;
};

export default JobsForNextDays;
