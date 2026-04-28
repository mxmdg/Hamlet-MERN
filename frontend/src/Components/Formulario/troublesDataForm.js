import React, { useEffect, useState } from "react";
import { getPrivateElements } from "../customHooks/FetchDataHook";
import FormMaterial from "./FormMaterial";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";

const buildPrinterOption = (item) => {
  const model = item.Modelo || "Sin modelo";
  const manufacturer = item.Fabricante || "";
  const serial = item.SerialNumber ? ` (${item.SerialNumber})` : "";

  return {
    text: `${model} ${manufacturer}`.trim() + serial,
    value: item._id,
    id: item._id,
  };
};

const buildMaterialOption = (item) => {
  const name =
    item.Nombre_Material || item.Nombre_material || item.nombre || "Material";
  const brand = item.Marca ? ` - ${item.Marca}` : "";

  return {
    text: `${name}${brand}`,
    value: item._id,
    id: item._id,
  };
};

const getSourceOptionsByType = (sourceType, printerOptions, materialOptions) => {
  if (sourceType === "printers") return printerOptions;
  if (sourceType === "materiales") return materialOptions;
  return [...printerOptions, ...materialOptions];
};

const TroublesDataForm = (props) => {
  const [troublesDataForm, setTroublesDataForm] = useState([]);
  const [useLoading, setLoading] = useState(true);
  const [useError, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const printers = await getPrivateElements("impresoras");
        const materials = await getPrivateElements("materiales");

        const printerOptions = printers.map(buildPrinterOption);
        const materialOptions = materials.map(buildMaterialOption);
        const initialSourceOptions = getSourceOptionsByType(
          null,
          printerOptions,
          materialOptions,
        );

        setTroublesDataForm([
          {
            label: "Origen de la falla",
            type: "Divider",
            id: "trblDiv1",
            size: 12,
            align: "center",
            orientation: "horizontal",
          },
          {
            inputName: "sourceType",
            label: "Falla de:",
            type: "Select",
            options: [
              { text: "Impresora", value: "printers" },
              { text: "Material", value: "materiales" },
            ],
            onChange: (event) => {
              const selectedType = event.target.value;
              const sourceOptions = getSourceOptionsByType(
                selectedType,
                printerOptions,
                materialOptions,
              );

              setTroublesDataForm((currentForm) =>
                currentForm.map((input) =>
                  input.inputName === "sourceId"
                    ? { ...input, options: sourceOptions }
                    : input,
                ),
              );
            },
            id: "id_001",
            size: { xs: 12, sm: 6 },
            required: true,
          },
          {
            inputName: "sourceId",
            label: "Elemento afectado",
            type: "Select",
            options: initialSourceOptions,
            id: "id_002",
            size: { xs: 12, sm: 6 },
            required: true,
          },
          {
            label: "Descripcion de la falla",
            type: "Divider",
            id: "trblDiv2",
            size: 12,
            align: "center",
            orientation: "horizontal",
          },
          {
            inputName: "code",
            label: "Codigo de falla",
            type: "Text",
            id: "id_003",
            size: { xs: 12, sm: 6 },
            required: false,
          },
          {
            inputName: "severity",
            label: "Gravedad de la falla",
            type: "Select",
            id: "id_010",
            size: { xs: 12, sm: 6 },
            options: [
              { text: "Bajo", value: "bajo" },
              { text: "Medio", value: "medio" },
              { text: "Alto", value: "alto" },
            ],
            default: "medio",
            required: true,
          },
          {
            inputName: "description",
            label: "Descripcion",
            type: "Text",
            multiline: true,
            id: "id_004",
            size: { xs: 12, sm: 6 },
            required: true,
          },
          {
            inputName: "solution",
            label: "Solucion",
            type: "Text",
            multiline: true,
            id: "id_005",
            size: { xs: 12, sm: 6 },
            required: true,
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const success = (
    <FormMaterial
      form={troublesDataForm}
      collection={props.collection}
      task={props.task}
      title={props.title}
      subtitle={props.subtitle}
      submitText={props.submitText}
      color={props.color}
      variant={props.variant}
    />
  );

  const errorRender = (
    <ErrorMessage
      message={useError?.message || useError || "Error Inesperado"}
      action={() => {
        setError(null);
      }}
      title={"Error al cargar datos"}
    />
  );

  const loadingRender = <Spinner />;

  return useLoading ? loadingRender : useError !== null ? errorRender : success;
};

export default TroublesDataForm;
