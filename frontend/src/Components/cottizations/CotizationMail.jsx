import { databaseURL } from "../Config/config";

export const CotizationMail = ({ cotizacion, cliente, items, jobName }) => {
    const currencyFormat = (num) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(num);
    };

    let itemsList = "";
    
      if (items && Array.isArray(items) && items.length > 0) {
        itemsList = items
          .map(
            (item) =>
              `${item.Name} (${item.jobParts[0].Type})
           Pags: ${item.Pages} Formato: ${item.Ancho} x ${item.Alto}- Material: ${item.partStock.Tipo} ${item.partStock.Gramaje}`
          )
          .join("\n"); // o "<br/>" si lo vas a meter en HTML
      }

    const quoteMessagePlain = `
    Presupuesto Número ${cotizacion.data.index}
    Trabajo: ${jobName} - Tipo: ${cotizacion.data.jobType}
    Cantidad: ${cotizacion.data.quantity}
    ${itemsList}
    Precio Unitario: ${cotizacion.data.total / cotizacion.data.quantity}
    Precio final: ${cotizacion.data.total} (IVA incluido)
    `;

    const quoteMessageHTML = `
    <h2>Presupuesto Número ${cotizacion.data.index}</h2>
    <h3>${cliente.nombre || cliente.razonSocial || cliente}</h3>
    <h4><b>Trabajo:</b> ${jobName} </h4>
    <p>
    <b>Tipo:</b> ${cotizacion.data.jobType} <br/>
    <b>Cantidad:</b> ${cotizacion.data.quantity}</p>
    ${
        items && items.length > 0
        ? `
        <h3>Detalle</h3>
        <ul>
        ${items
            .map(
            (item) => `
            <li><b>${item.Name}</b> ${item.jobParts[0].Type}: ${item.partStock.Tipo} ${item.partStock.Gramaje} — ${item.Pages} páginas ${item.ColoresFrente}/${item.ColoresDorso} formato ${item.Ancho} x ${item.Alto}</li>
        `
            )
            .join("")}
        </ul>
    `
        : ""
    }
    <p><b>Precio unitario:</b> ${currencyFormat(cotizacion.data.total / cotizacion.data.quantity)}</p>
    <p style="font-size:1.2em; color:#1976d2;"><b>Precio final:</b> ${currencyFormat(
        cotizacion.data.total
    )} (IVA incluido)</p>
    <hr/>
    <p>
    <a 
        href={"${databaseURL}/quotations/${cotizacion.data._id}/"} 
        style={{
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "10px 15px",
        textDecoration: "none",
        borderRadius: "5px",
        marginRight: "10px"
        }}
    >
        ✅ Aprobar
    </a>
    
    <a 
        href={"${databaseURL}/quotations/${cotizacion.data._id}/"} 
        style={{
        backgroundColor: "#F44336",
        color: "white",
        padding: "10px 15px",
        textDecoration: "none",
        borderRadius: "5px"
        }}
    >
        ❌ Rechazar
    </a>
    </p>
    <p>Este presupuesto es válido por 30 días a partir de la fecha de emisión.</p>
    <p>Si tiene alguna consulta o desea proceder con el pedido, no dude en contactarnos.</p>
    <p>Muchas gracias por su consulta,<br/>
    <em>Equipo de Impresiones</em></p>
    `;
    return {quoteMessageHTML, quoteMessagePlain, itemsList};
};

