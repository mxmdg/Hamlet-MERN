import { addPrivateElement } from "../../customHooks/FetchDataHook";
import { mmToPt } from "../generalData/unitConverter";

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

  data.partes = partsData;

  console.log(data);

  // OJO: no atrapamos el error acá para devolverlo como valor -- lo dejamos
  // propagarse (relanzándolo con un mensaje legible) para que el catch de
  // xmlHandler, en CotizacionCard.jsx, sea el que de verdad se entere.
  try {
    const res = await addPrivateElement(`SendToApogee`, data);
    const xmlData = new Blob([res.data], {
      type: "application/vnd.cip4-jdf+xml",
    });
    const xmlURL = URL.createObjectURL(xmlData);
    const link = document.createElement("a");
    link.href = xmlURL;
    link.download = `${data.orden + "_" + data.nombre}.jdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log(error);
    const mensajeServidor = error.response?.data?.error;
    throw error;
  }
};
