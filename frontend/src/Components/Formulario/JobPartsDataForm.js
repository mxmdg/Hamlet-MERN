import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JobTypes from "../Jobs/JobTypes";
import {
  getPrivateElementByID,
  getPrivateElements,
} from "../customHooks/FetchDataHook";
import FormMaterial from "./FormMaterial";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";

const MoldeJobParts = [
  {
    label: "Configuracion de Partes",
    type: "Divider",
    id: "partSettings_div",
    size: 12,
    align: "center",
    orientation: "horizontal",
  },
  {
    inputName: "Type",
    label: "Tipo de parte",
    size: 6,
    type: "Text",
    id: "id_401",
  },
  {
    inputName: "jdfType",
    label: "Definicion JDF",
    size: 6,
    type: "Select",
    id: "id_4011",
    options: [
      { text: "Cubierta", value: "Cover" },
      { text: "Cubierta en partes separadas", value: "SeparatedCover" },
      { text: "Inserción", value: "Insert" },
      { text: "Cuerpo", value: "Body" },
      { text: "Plano", value: "Flatwork" },
    ],
  },
  {
    inputName: "minWidth",
    label: "Ancho Minimo",
    type: "SmartMeasure",
    subtype: "length",
    size: { sm: 12, md: 3 },
    step: 1,
    id: "id_402",
  },
  {
    inputName: "maxWidth",
    label: "Ancho Maximo",
    type: "SmartMeasure",
    subtype: "length",
    size: { sm: 12, md: 3 },
    step: 1,
    id: "id_403",
  },
  {
    inputName: "minHeight",
    label: "Alto Minimo",
    type: "SmartMeasure",
    subtype: "length",
    size: { sm: 12, md: 3 },
    step: 1,
    id: "id_404",
  },
  {
    inputName: "maxHeight",
    label: "Alto Maximo",
    type: "SmartMeasure",
    subtype: "length",
    size: { sm: 12, md: 3 },
    step: 1,
    id: "id_405",
  },
  {
    inputName: "minPages",
    label: "Cantidad minima de paginas",
    type: "SmartMeasure",
    size: { sm: 12, md: 3 },
    step: 1,
    id: "id_406",
  },
  {
    inputName: "maxPages",
    label: "Cantidad máxima de paginas",
    type: "SmartMeasure",
    size: { sm: 12, md: 3 },
    step: 1,
    id: "id_407",
  },
  {
    inputName: "minStockWeight",
    label: "Gramaje minimo",
    type: "SmartMeasure",
    subtype: "weight",
    size: { sm: 12, md: 3 },
    id: "id_409",
  },
  {
    inputName: "maxStockWeight",
    label: "Gramaje maximo",
    type: "SmartMeasure",
    subtype: "weight",
    size: { sm: 12, md: 3 },
    id: "id_410",
  },
  {
    inputName: "PrintModAllowed",
    label: "Modo de impresion permitido",
    type: "Select",
    size: { sm: 12, md: 6 },
    id: "id_408",
    options: [
      { text: "Simplex", value: "Simplex" },
      { text: "Duplex", value: "Duplex" },
    ],
  },
  {
    type: "Divider",
    id: "jobAllowed_div",
    size: 12,
    align: "center",
    orientation: "horizontal",
  },
  {
    inputName: "jobTypesAllowed",
    label: "Tipos de trabajos asociados",
    type: "checkbox",
    id: "id_411",
    options: JobTypes.map((jt) => jt.name),
  },
  {
    type: "Divider",
    id: "finishers_div",
    size: 12,
    align: "center",
    orientation: "horizontal",
  },
  {
    inputName: "finishers",
    label: "Terminaciones asociadas",
    type: "checkbox",
    size: 12,
    id: "id_412",
    options: [],
  },
];

const JobPartsDataForm = (props) => {
  const params = useParams();
  const [jobPartsDataForm, setJobPartsDataForm] = useState(MoldeJobParts);
  const [item, setItem] = useState(props.item);
  const [loading, setLoading] = useState(props.task !== "new");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allFinishers = await getPrivateElements("finishers");
        const finisherLabel = (finisher) =>
          `${finisher.Proceso === "0" || finisher.Proceso === undefined ? "" : finisher.Proceso || ""} 
            ${finisher.Modelo === "0" || finisher.Modelo === undefined ? "" : finisher.Modelo   || ""} 
            ${finisher.Fabricante === "0" || finisher.Fabricante === undefined ? "" : finisher.Fabricante || ""}`.trim();

        let jobPart = props.item;
        let enabledFinishers = [];

        if (props.task !== "new") {
          const id = params.id || props.id;
          jobPart = await getPrivateElementByID("JobParts", id);
          enabledFinishers = await getPrivateElements(
            `finishers/jobPart/${encodeURIComponent(jobPart.Type)}`
          );
        }

        const enabledIds = new Set(enabledFinishers.map((finisher) => finisher._id));
        const finisherOptions = allFinishers.map((finisher) => ({
          text: finisherLabel(finisher),
          value: finisher._id,
          id: finisher._id,
        }));

        setJobPartsDataForm((form) =>
          form.map((field) =>
            field.inputName === "finishers"
              ? { ...field, options: finisherOptions }
              : field
          )
        );
        setItem(
          props.task === "new"
            ? props.item
            : { ...jobPart, finishers: finisherOptions.map((option) => option.value).filter((id) => enabledIds.has(id)) }
        );
      } catch (fetchError) {
        setError(fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, props.id, props.task]);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <ErrorMessage
        message={error?.message || error || "Error Inesperado"}
        action={() => setError(null)}
        title="Error al cargar datos"
      />
    );
  }

  return (
    <FormMaterial
      {...props}
      form={jobPartsDataForm}
      item={props.task === "new" ? undefined : item}
    />
  );
};

export { MoldeJobParts };
export default JobPartsDataForm;
