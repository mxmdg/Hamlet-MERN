import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Spinner from "../General/Spinner";

import JobDetail from "./JobDetail";

import {
  addPrivateElement,
  getPrivateElments,
  getPrivateElementByID,
  putPrivateElement,
  deletePrivateElement,
} from "../customHooks/FetchDataHook";

export const JobViewer = (props) => {
  const [useCurrentJob, setCurrentJob] = useState(null);
  const [useLoading, setLoading] = useState(true);
  //const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const currentJob = await getPrivateElementByID(props.entity, id);
        console.log(currentJob);
        setCurrentJob(currentJob.data);
        setLoading(false);
        console.log(currentJob.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchJob();
  }, [setCurrentJob]);

  const preloader = (
    <>
      <Spinner />
    </>
  );

  const output = () => {
    if (useLoading === false && useCurrentJob !== null) {
      return (
        <>
          {/* <div margin="10px">
            <h1>Trabajo {useCurrentJob.Nombre}</h1>
            <h2>Cantidad: {useCurrentJob.Cantidad}</h2>
            <h3>
              {useCurrentJob.Owner?.Name} {useCurrentJob.Owner?.LastName}
            </h3>
            <h6>{useCurrentJob.Owner?.email}</h6>
            <h3>{useCurrentJob.Fecha}</h3>
            <h3>{useCurrentJob.Entrega}</h3>
          </div> */}
          <JobDetail job={useCurrentJob} />
          {/* <div>
            {useCurrentJob.Partes.map((part) => {
              return (
                <>
                  <div>
                    <h1>{part.jobParts[0].type}</h1>
                    <h3>
                      Formato: {part.Ancho} x {part.Alto}
                    </h3>
                    <h3>Paginas: {part.Pages}</h3>
                    <h4>
                      Impresion: {part.ColoresFrente} / {part.ColoresDorso}
                    </h4>
                    <h3>Material: {part.partStock.Nombre_Material}</h3>
                  </div>
                </>
              );
            })}
          </div> */}
        </>
      );
    } else {
      return preloader;
    }
  };
  return output();
};
