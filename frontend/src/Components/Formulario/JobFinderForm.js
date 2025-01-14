import React, { useState, useEffect } from "react";
import JobTypes from "../Jobs/JobTypes";
import { getPrivateElements } from "../customHooks/FetchDataHook";
import FormMaterial from "./FormMaterial";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../General/Spinner";

const JobFinderForm = (props) => {
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
        const materiales = await getPrivateElements("materiales");
        const jobParts = await getPrivateElements("jobParts");
        const users = await getPrivateElements("users");
        const companies = await getPrivateElements("empresas");

        const costsList = [];
        const partsList = [];

        /* parts.map((pt) => partsList.push(pt.Type));
        res.map((item) => {
          if (item.Categoria === "finishing") {
            costsList.push({
              text: `${item.Proceso} ($ ${item.Valor}.-)`,
              value: item._id,
              id: item._id,
            });
          }
        }); */

        setFinishersDataForm([
          {
            inputName: "Propiedad",
            label: "Buscar por",
            type: "Select",
            id: "id_001",
            required: true,
            options: [
              { text: "Nombre", value: "Nombre" },
              { text: "Cantidad", value: "Cantidad" },
              { text: "Material", value: "Partes.partStock" },
              { text: "Tipo de trabajo", value: "Tipo.id" },
              { text: "Tipo de parte", value: "Partes.jobParts._id" },
              { text: "Usuario", value: "Owner" },
              { text: "Empresa", value: "Company" },
            ],
          },
          {
            inputName: "Material",
            label: "Material",
            type: "Select",
            id: "id_002",
            required: false,
            options: [
              materiales.map((mat) => {
                return {
                  text: `${mat.gramaje}`,
                  value: mat._id,
                };
              }),
            ],
          },
          {
            inputName: "jobType",
            label: "Tipo de Trabajo",
            type: "Select",
            id: "id_003",
            required: false,
            options: JobTypes.map((jt) => {
              return { text: jt.name, value: jt.id };
            }),
          },
          {
            inputName: "jobPart",
            label: "Tipo de Parte",
            type: "Select",
            id: "id_004",
            required: false,
            options: jobParts.map((jp) => {
              return { text: jp.Type, value: jp._id };
            }),
          },
          {
            inputName: "users",
            label: "Usuario",
            type: "Select",
            id: "id_005",
            required: false,
            options: users.map((user) => {
              return { text: `${user.Name} ${user.LastName}`, value: user._id };
            }),
          },
          {
            inputName: "company",
            label: "Empresa",
            type: "Select",
            id: "id_006",
            required: false,
            options: companies.map((company) => {
              return { text: company.Nombre, value: company._id };
            }),
          },
          {
            inputName: "cantidad",
            label: "Cantidad",
            type: "Number",
            id: "id_007",
            required: false,
          },
          {
            inputName: "nombre",
            label: "Nombre",
            type: "Text",
            id: "id_008",
            required: false,
          },
          {
            inputName: "search",
            label: "Buscar",
            type: "button",
            id: "id_009",
            clickHandler: (e) => {
              console.log(e);
            },
          },
        ]);
        setLoading(false);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  const success = (
    <FormMaterial
      form={finishersDataForm}
      collection={props.collection}
      task={"new"}
    />
  );

  const errorRender = (
    <ErrorMessage
      message={useError}
      action={() => {
        setError(null);
      }}
    />
  );

  const loadingRender = <Spinner />;

  return useLoading ? loadingRender : useError !== null ? errorRender : success;
};

export default JobFinderForm;
