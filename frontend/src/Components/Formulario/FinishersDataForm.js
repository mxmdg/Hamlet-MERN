import React, { useState, useEffect } from "react";
import JobTypes from "../Jobs/JobTypes";
import { getPrivateElements } from "../customHooks/FetchDataHook";
import FormMaterial from "./FormMaterial";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";

const FinishersDataForm = (props) => {
  /*Recibe por props los atributos que necesita el formulario.
 Este componente actua de intermediario antes de cargar el formulario, 
 para poder traer elementos de la base de datos.

 props.task = "new" | "copy" | "edit"

 props.collection = "finishers" (parece redundante, pero tal vez este componente se utilice con otras colecciones... no se sabe)
 
 */

  const [finishersDataForm, setFinishersDataForm] = useState([]);
  const [useLoading, setLoading] = useState(true);
  const [useError, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPrivateElements("Precios");
        const parts = await getPrivateElements("JobParts");

        const costsList = [];
        const partsList = [];

        parts.map((pt) => partsList.push(pt.Type));
        try {
          res.map((item) => {
            if (item.Categoria === "finishing") {
              costsList.push({
                text: `${item.Proceso} ($ ${item.Valor}.-)`,
                value: item._id,
                id: item._id,
              });
            }
          });
        } catch (error) {
          setError({ message: "Error cargando lista de precios" });
        }

        setFinishersDataForm([
          {
            inputName: "Modelo",
            type: "Text",
            id: "id_001",
            required: true,
          },
          {
            inputName: "Fabricante",
            type: "Text",
            id: "id_002",
            required: true,
          },
          {
            inputName: "Proceso",
            type: "Text",
            id: "id_003",
            required: true,
          },
          {
            inputName: "X_Minimo",
            label: "Largo Minimo",
            type: "Number",
            id: "id_004",
            required: true,
          },
          {
            inputName: "X_Maximo",
            label: "Largo Maximo",
            type: "Number",
            id: "id_005",
            required: true,
          },
          {
            inputName: "Y_Minimo",
            label: "Ancho Minimo",
            type: "Number",
            id: "id_006",
            required: true,
          },
          {
            inputName: "Y_Maximo",
            label: "Ancho Maximo",
            type: "Number",
            id: "id_007",
            required: true,
          },
          {
            inputName: "Velocidad",
            type: "Number",
            id: "id_008",
            required: true,
          },
          {
            inputName: "Costo",
            type: "Select",
            id: "id_009",
            options: costsList,
            required: true,
          },
          {
            inputName: "Unidad",
            label: "Unidad de medida",
            type: "Select",
            id: "id_010",
            options: [
              { text: "Unidades", value: "un" },
              { text: "Originales", value: "or" },
              { text: "Pliegos", value: "pl" },
              { text: "Longitud", value: "cm" },
              { text: "Peso", value: "kg" },
              { text: "Superficie", value: "m2" },
              { text: "Costo Fijo", value: "CF" },
              { text: "Porcentaje", value: "PerCent" },
            ],
            required: true,
          },
          {
            inputName: "jobTypesAllowed",
            label: "Tipos de trabajos asociados",
            type: "checkbox",
            id: "id_012",
            options: JobTypes.map((jt) => jt.name),
          },
          {
            inputName: "partTypesAllowed",
            label: "Tipos de Partes asociados",
            type: "checkbox",
            id: "id_011",
            options: partsList.map((pt) => pt),
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
      form={finishersDataForm}
      collection={props.collection}
      task={props.task}
      title={props.title}
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

export default FinishersDataForm;
