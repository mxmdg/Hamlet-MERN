import React, { useEffect } from "react";
import NewStackedBarChart from "./NewStackedBarChart";
import { NewSimpleLineChart } from "./NewSimpleLineChart";
import JobTypes from "../../Jobs/JobTypes";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { getMyDate as formatDateFromDict } from "../generalData/fechaDiccionario";

const JobsForNextDays = (props) => {
  const [useError, setError] = React.useState(null);
  const [from, setFrom] = React.useState(props.from || 1);
  const [to, setTo] = React.useState(props.to || 60); // next 60 days
  const [graphTitle, setGraphTitle] = React.useState(
    props.title || `Trabajos para los próximos ${to} días`
  );
  const errorRef = React.useRef(false); // Bandera de control

  useEffect(() => {
    // Calcula fecha de inicio y fin a partir de los offsets `from` y `to`
    const today = new Date();

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - from);

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + to);

    errorRef.current = false; // Resetea la bandera de error al cambiar las fechas
    setError(null); // Limpia cualquier error previo
    setGraphTitle(
      `Trabajos desde ${formatDateFromDict(startDate).ddmmyy} al ${
        formatDateFromDict(endDate).ddmmyy
      }`
    ); // Actualiza el título del gráfico
  }, [from, to]);

  let outDate = {};

  try {
    for (let job of props.jobs) {
      const Salida = formatDateFromDict(job.Entrega).ddmmyy;
      const yesterday = new Date();
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + to); // next 30 days
      yesterday.setDate(today.getDate() - from); //Ayer

      //try {
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
      //}
      /* catch (error) {
        if (!errorRef.current) {
          errorRef.current = true; // Se marca que ya ocurrió un error
          setError(error); // Actualiza el estado con el error solo una vez
        }
        console.log(error);
        console.log(job);
      } */
    }
  } catch (error) {
    setError(error);
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
    <NewStackedBarChart
      data={jobsPerOutDate}
      dataKey={dataKeys}
      title={graphTitle}
      selectFrom={setFrom}
      selectTo={setTo}
      route={props.route}
    />
  ) : (
    <ErrorMessage
      message={useError.message}
      color="warning"
      action={() => {
        errorRef.current = false; // Resetea la bandera cuando se limpia el error
        setError(null);
      }}
    />
  );
};

export default JobsForNextDays;
