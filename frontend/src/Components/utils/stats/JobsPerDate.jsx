import React from "react";
import { NewSimpleLineChart } from "./NewSimpleLineChart";
import SimpleAreaChart from "./SimpleAreaChart";

const JobsPerDate = (props) => {
  // Calcular la cantidad de trabajos por cliente.
  // Recibe la lista de trabajos en props.jobs

  const [useRank, setRank] = React.useState(6);

  function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
  }

  var result = getWeekNumber(new Date());
  console.log("Year: " + result[0] + ", Week: " + result[1]);

  const getMyDate = (event) => {
    const dd = new Date(event).getUTCDate();
    const mm = new Date(event).getUTCMonth();
    const yy = new Date(event).getFullYear();
    const ww = getWeekNumber(new Date(event));

    const MiDate = `${dd}/${mm + 1}/${yy}`;
    const MiMont = `${mm + 1}/${yy}`.toString();

    return { ddmmyy: MiDate, mmyy: MiMont, ww };
  };

  let inDate = {};

  for (let job of props.jobs) {
    const Entrada = getMyDate(job.Fecha).mmyy;
    const Salida = getMyDate(job.Entrega).mmyy;
    if (inDate[Entrada]) {
      inDate[Entrada].inJobs >= 1
        ? (inDate[Entrada].inJobs += 1)
        : (inDate[Entrada].inJobs = 1);
    } else inDate[Entrada] = { inJobs: 1, name: `${Entrada}` };

    if (inDate[Salida]) {
      inDate[Salida].outJobs >= 1
        ? (inDate[Salida].outJobs += 1)
        : (inDate[Salida].outJobs = 1);
    } else inDate[Salida] = { outJobs: 1, name: `${Salida}` };
  }

  const jobsPerInDate = Object.values(inDate).sort((a, b) => {
    const dateA = new Date("01/" + a.name).getTime();
    const dateB = new Date("01/" + b.name).getTime();
    return dateA - dateB;
  });

  return (
    <SimpleAreaChart
      data={jobsPerInDate}
      dataKey={["name", "inJobs", "outJobs"]}
      title={"Trabajos por fecha de entrada y salida"}
    />
  );
};

export default JobsPerDate;
