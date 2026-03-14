import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../General/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MyStepper from "../Jobs/Stepper";
import { importFromPapyrus } from "../customHooks/FetchDataHook";
import { queryDetalleOT } from "../utils/PropertiesMaps/sqlQueries";

const PapyrusCopy = () => {
  const [useJob, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchFromPapyrus = async () => {
      try {
        setLoading(true);
        // 1. Limpiamos el ID (27650-DIG-7 -> 27650)
        const otNumber = id.split("-")[0];
        console.log("OT: ", otNumber)
        
        // 2. Traemos la data cruda
        const sql = queryDetalleOT(otNumber);
        const url = process.env.REACT_APP_PAPYRUS_API || "http://181.104.19.45:3001/api/papyrus/extract";
        
        const rows = await importFromPapyrus({ sql }, url);

        if (!rows || rows.length === 0) throw new Error("OT no encontrada en Papyrus");

        console.log(rows)

        // 3. Transformamos filas SQL en un objeto Job de Hamlet
        const jobMimetizado = transformSqlToHamlet(rows);

        setJob(jobMimetizado);
        console.log(jobMimetizado)
        setLoading(false);
      } catch (e) {
        setError({ message: e.message });
        setLoading(false);
      }
    };

    fetchFromPapyrus();
  }, [id]);

  if (loading) return <Spinner color="primary" />;
  if (error) return <ErrorMessage message={error.message} action={() => window.history.back()} />;

  // Al pasarle el job, el Stepper entrará en modo "Edición/Copia" automáticamente
  return <MyStepper job={useJob} />;
};

/**
 * Función que convierte el array de filas de Papyrus 
 * en la estructura que espera JobsForm y JobsParts
 */
const transformSqlToHamlet = (rows) => {
  const first = rows[0];

  const otDetail = ({
    Nombre: first.Nombre || first.detalle_trabajo || "Nuevo Trabajo (Papyrus)",
    Company: {Nombre: first.Company || first.cliente_nombre},
    Cantidad: first.Cantidad || 0,
    Entrega: first.entrega_fecha,
    Tipo: {name: first.tipo_producto},
    Description: first.obs_produccion || "",
    // Inicializamos como strings para la conciliación posterior
    Finishing: [], 
    Partes: rows.reduce((acc, row) => {
      // Evitamos duplicados por las filas de entregas
      if (!acc.find(p => p.num_parte === row.nro_parte)) {
        acc.push({
          Name: row.nombre_parte || "Parte",
          num_parte: row.nro_parte,
          Alto: row.Alto,
          Ancho: row.Ancho,
          Pages: row.Paginas,
          jobParts: [{Type: row.tipo_producto}],
          jobTypesAllowed: [], 
          partStock: [{
            Nombre_Material: row.papel_nombre,
            Gramage: row.papel_gramaje,
            Size: `${row.papel_largo}x${row.papel_ancho}`,
          }],
          ColoresFrente: row.colores_frente || 0,
          ColoresDorso: row.colores_dorso || 0,
          // Pasamos los nombres de procesos como array
          Finishing: row.procesos_lista ? row.procesos_lista.split(' | ') : []
        });
      }
      return acc;
    }, [])
  });

  console.log(otDetail)
  return otDetail
};

export default PapyrusCopy;