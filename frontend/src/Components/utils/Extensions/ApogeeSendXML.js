import { addPrivateElement } from "../../customHooks/FetchDataHook";
import { mmToPt } from "../generalData/unitConverter";

export const sendXML = async (jobToSend, cot) => {
    const data = {orden: "H-" + cot.index, 
                  nombre: jobToSend.Nombre,
                  tipoTrabajo: jobToSend.Tipo[0].name,
                  // Suspendemos el envío de datos de cliente real a Apogee por ahora, evitamos conflictos con los clientes existentes en webapproval.                 
                  cliente: jobToSend.Company.Nombre, 
                  contactoClienteNombre: jobToSend.Owner?.Name || "Juan", 
                  contactoClienteApellido: jobToSend.Owner?.LastName || "Pérez",
                  contactoClienteEmail: jobToSend.Owner?.Email || "jp@gmail.com",
                  cantidad: parseInt(jobToSend.Cantidad),
                  entrega: jobToSend.Entrega,
                  jobId: jobToSend._id,
                }

    const partsData = jobToSend.Partes.map((part)=> {
      return {
          _id: part.jobParts?.[0]?._id,
          nombreParte: part.Name,
          tipoParte: part.jobParts?.[0]?.Type,
          ancho: mmToPt(part.Ancho), 
          alto: mmToPt(part.Alto),
          colores: {frente: part.ColoresFrente, dorso: part.ColoresDorso}, 
          paginas: parseInt(part.Pages),
          gramaje: parseInt(part.partStock.Gramaje),
          materialTipo: part.partStock.Tipo,
          anchoResma: mmToPt(cot.data.impositionData[part._id].impositionData.sheetOriginalSize.width),
          altoResma: mmToPt(cot.data.impositionData[part._id].impositionData.sheetOriginalSize.height),
          impresora: cot.data.impositionData[part._id].impositionData.printerSelector.Modelo,
          tipoParteId: part.jobParts?.[0]?._id,
      }
    })
    
    data.partes = partsData

    console.log(data)
    
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
      return { error: error.message || "Error al enviar el trabajo a Apogee" };
    }
  };
