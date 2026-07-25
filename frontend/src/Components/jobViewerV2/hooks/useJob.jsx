// jobViewerV2/hooks/useJob.js
import { useState, useEffect } from "react";
import { getPrivateElementByID } from "../../customHooks/FetchDataHook";

/**
 * Trae un trabajo — por props.job (ya cargado) o bajándolo por id.
 * No sabe nada de presentación. Solo devuelve { job, loading, error }.
 *
 * @param {Object}  opts
 * @param {Object}  [opts.job]     Trabajo ya cargado (contexto embebido).
 * @param {string}  [opts.id]      Id del trabajo a bajar (contexto ruta).
 * @param {string}  [opts.entity]  Entidad para el fetch (default "jobs").
 */
export const useJob = ({ job: jobProp, id, entity = "jobs" }) => {
  const [job, setJob] = useState(jobProp ?? null);
  const [loading, setLoading] = useState(!jobProp);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Caso 1: el trabajo ya vino por props. No hay nada que bajar.
    if (jobProp) {
      setJob(jobProp);
      setLoading(false);
      setError(null);
      return;
    }

    // Caso 2: no hay id para bajar. Estado inválido, lo reportamos.
    if (!id) {
      setError({ message: "No se recibió ni un trabajo ni un id." });
      setLoading(false);
      return;
    }

    // Caso 3: bajamos el trabajo por id.
    let cancelled = false; // evita setState si el componente se desmontó
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPrivateElementByID(entity, id);
        if (cancelled) return;
        data
          ? setJob(data)
          : setError({ message: "Trabajo inexistente" });
      } catch (err) {
        if (!cancelled) setError({ message: err.message || "Error al traer el trabajo" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchJob();
    return () => { cancelled = true; };
  }, [jobProp, id, entity]);

  return { job, loading, error };
};