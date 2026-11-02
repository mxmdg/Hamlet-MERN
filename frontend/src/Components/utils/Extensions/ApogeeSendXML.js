import { addPrivateElement, getPrivateElementByID } from "../../customHooks/FetchDataHook";
import { mmToPt } from "../generalData/unitConverter";

const descargar = (contenido, nombre) => {
  const blob = new Blob([contenido], { type: "application/vnd.cip4-jdf+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nombre;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const sendXML = async (jobToSend, cot) => {
  const data = {
    orden: "H-" + cot.index,
    nombre: jobToSend.Nombre,
    tipoTrabajo: jobToSend.Tipo[0].name,
    cliente: jobToSend.Company.Nombre,
    idCliente: jobToSend.Company._id,
    contactoClienteNombre: jobToSend.Owner?.Name || "Juan",
    contactoClienteApellido: jobToSend.Owner?.LastName || "Pérez",
    contactoClienteEmail: jobToSend.Owner?.Email || "jp@gmail.com",
    cantidad: parseInt(jobToSend.Cantidad),
    entrega: jobToSend.Entrega,
    jobId: jobToSend._id,
  };

  const partsData = jobToSend.Partes.map((part) => ({
    _id: part.jobParts?.[0]?._id,
    nombreParte: part.Name,
    tipoParte: part.jobParts?.[0]?.Type,
    ancho: mmToPt(part.Ancho),
    alto: mmToPt(part.Alto),
    colores: { frente: part.ColoresFrente, dorso: part.ColoresDorso },
    paginas: parseInt(part.Pages),
    RunList: part.RunList,
    gramaje: parseInt(part.partStock.Gramaje),
    materialTipo: part.partStock.Tipo,
    anchoResma: mmToPt(cot.data.impositionData[part._id].impositionData.sheetOriginalSize.width),
    altoResma: mmToPt(cot.data.impositionData[part._id].impositionData.sheetOriginalSize.height),
    impresora: cot.data.impositionData[part._id].impositionData.printerSelector.Modelo,
    tipoParteId: part.jobParts?.[0]?._id,
  }));

  // jdfType desde el catálogo (no desde la copia guardada en el trabajo)
  const ids = [...new Set(partsData.map((p) => p._id).filter(Boolean))];
  const catalogo = await Promise.all(ids.map((id) => getPrivateElementByID("jobParts", id)));
  const esFlatwork = {};
  catalogo.forEach((c) => { esFlatwork[c._id] = c.jdfType === "Flatwork"; });

  const libro = partsData.filter((p) => !esFlatwork[p._id]);
  const flat = partsData.filter((p) => esFlatwork[p._id]);

  const grupos = [];
  if (libro.length) grupos.push({ partes: libro, tipoTrabajo: data.tipoTrabajo, sufijo: "_Libro" });
  if (flat.length) grupos.push({ partes: flat, tipoTrabajo: "Sin Encuadernacion", sufijo: "_Sin_Encuadernacion" });

  for (const g of grupos) {
    const res = await addPrivateElement("SendToApogee", {
      ...data,
      tipoTrabajo: g.tipoTrabajo,
      partes: g.partes,
    });
    const nombre = grupos.length > 1
      ? `${data.orden}_${data.nombre}${g.sufijo}.jdf`
      : `${data.orden}_${data.nombre}.jdf`;
    descargar(res.data, nombre);
  }
};