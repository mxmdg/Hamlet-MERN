const jobParts = require("../models/jobParts");

const escapeXML = (value) => {
  if (value === null || value === undefined) return "";
  return value
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asPositiveInt = (value, fallback = 1) => {
  const parsed = Math.trunc(toNumber(value, fallback));
  return parsed > 0 ? parsed : fallback;
};

const slugForPath = (value, fallback = "item") => {
  const raw = value === null || value === undefined ? "" : value.toString().trim();
  if (!raw) return fallback;
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w.-]+/g, "_");
};

const decodePathValue = (value) => {
  try {
    return decodeURIComponent(value);
  } catch (_error) {
    return value;
  }
};

const sanitizeFolderName = (value, fallback = "item") => {
  const raw = value === null || value === undefined ? "" : value.toString();
  if (!raw.trim()) return fallback;
  const decoded = decodePathValue(raw);
  const cleaned = decoded.replace(/[\/<>:"\\|?*]+/g, "").trim();
  return cleaned || fallback;
};

const binding = {
	"Libro": "Gathering",
	"Revista": "Collecting",
	"Sin Encuadernacion": "None",
	"Multipagina": "None",
	"Cosido a Hilo": "Collecting",
	"Anillado": "Gathering",
}

const jobTypeFinal = {
	"Libro": "Brochure",
	"Revista": "Brochure",
	"Sin Encuadernacion": "Flatwork",
	"Multipagina": "Flatwork",
	"Cosido a Hilo": "Brochure",
	"Anillado": "Brochure",
}

const getSides = (colores = {}) =>
  toNumber(colores?.dorso, 0) > 0 ? "TwoSidedHeadToHead" : "OneSidedFront";

const getColorIntentRef = (colores = {}) =>
  toNumber(colores?.frente, 0) > 1 || toNumber(colores?.dorso, 0) > 1
    ? "ID_ColorIntent_CMYK"
    : "ID_ColorIntent_Gray";

const buildPartialComponent = async (part, index, tenant) => {
  const partId = part?._id || part?.tipoParteId || part?.jobParts?.[0]?._id;
  let productDoc = null;
  if (partId) {
    try {
      productDoc = await jobParts.esquema.findOne({ _id: partId, tenant }).select("jdfType").lean();
    } catch (err) {
      console.error(`Error fetching jobPart ${partId}:`, err.message || err);
      productDoc = null;
    }
  }
  const productType = productDoc?.jdfType || "body";
  const displayName = `${part?.tipoParte || "Parte"}_${part?.nombreParte || `Parte_${index + 1}`}`;
  const readerPageCount = asPositiveInt(part?.paginas, 1);

  const agfa = productType === "Cover" ? `agfa:CoverType="Spread"` : "";

  return `\t\t<Component ID="ID_Component_${index}" Class="Quantity" Status="Unavailable" ProductType="${productType}" ${agfa} ComponentType="PartialProduct" DescriptiveName="${escapeXML(displayName)}" ReaderPageCount="${readerPageCount}"/>`;
};

const buildRootPartLink = (_part, index) =>
  `\t\t<ComponentLink rRef="ID_Component_${index}" Usage="Input"/>`;

const buildChildJDF = (part, index, context) => {
  const { rootJobPartId, nombre, cliente, nowIso } = context;

  const nombreParte = part?.nombreParte || `Parte_${index + 1}`;
  const paginas = asPositiveInt(part?.paginas, 1);
  const ancho = toNumber(part?.ancho, 0);
  const alto = toNumber(part?.alto, 0);
  const gramaje = asPositiveInt(part?.gramaje, 0);
  const materialTipo = part?.materialTipo || "Papel";
  const anchoResma = toNumber(part?.anchoResma, 0);
  const altoResma = toNumber(part?.altoResma, 0);
  const impresora = part?.impresora || "Large Press";
  const colorIntentRef = getColorIntentRef(part?.colores);
  const sides = getSides(part?.colores);
  const partPath = `${index + 1}-${sanitizeFolderName(nombreParte, `Parte_${index + 1}`)}`;
  const safeCliente = sanitizeFolderName(cliente, "Cliente");
  const safeNombre = sanitizeFolderName(nombre, "Trabajo");
  const url = `/${safeCliente}/${safeNombre}/${partPath}/${safeNombre}_${partPath}.pdf`;

  return `\t<JDF ID="ID_ProdPart_${index}" Type="Product" Status="Waiting" xsi:type="Product" JobPartID="${escapeXML(
    `${rootJobPartId}_${index}`,
  )}" DescriptiveName="${escapeXML(nombreParte)}">
\t\t<AuditPool>
\t\t\t<Created ID="crea_${index}_ID" AgentName="Hamlet Convertor" TimeStamp="${nowIso}" AgentVersion="1.3.3"/>
\t\t</AuditPool>
\t\t<Comment Name="Instruction" AgentName="Hamlet Convertor" AgentVersion="1.3.3">${escapeXML(
      part?.tipoParte || nombreParte,
    )}</Comment>
\t\t<ResourceLinkPool>
\t\t\t<ArtDeliveryIntentLink rRef="ID_ArtDeliveryIntent_${index}" Usage="Input"/>
\t\t\t<DeviceLink rRef="ID_Device_Press_${index}" Usage="Input"/>
\t\t\t<ComponentLink rRef="ID_Component_${index}" Usage="Output"/>
\t\t\t<ColorIntentLink rRef="${colorIntentRef}" Usage="Input"/>
\t\t\t<LayoutIntentLink rRef="ID_LayoutIntent_${index}" Usage="Input"/>
\t\t\t<MediaIntentLink rRef="ID_MediaIntent_${index}" Usage="Input"/>
\t\t</ResourceLinkPool>
\t\t<ResourcePool>
\t\t\t<LayoutIntent ID="ID_LayoutIntent_${index}" Class="Intent" Sides="${sides}" Status="Available">
\t\t\t\t<FinishedDimensions DataType="ShapeSpan" Actual="${ancho} ${alto} 0"/>
\t\t\t\t<Pages DataType="IntegerSpan" Actual="${paginas}"/>
\t\t\t</LayoutIntent>
\t\t\t<MediaIntent ID="ID_MediaIntent_${index}" Class="Intent" Status="Available" DescriptiveName="${escapeXML(
      `${materialTipo}-1`,
    )}">
\t\t\t\t<MediaType DataType="EnumerationSpan" Actual="Paper"/>
\t\t\t\t<Weight DataType="NumberSpan" Actual="${gramaje}"/>
\t\t\t\t<StockBrand DataType="StringSpan" Actual="${escapeXML(materialTipo)}"/>
\t\t\t\t<Grade DataType="IntegerSpan" Actual="1"/>
\t\t\t\t<Thickness DataType="NumberSpan" Actual="200"/>
\t\t\t\t<Dimensions DataType="XYPairSpan" Actual="${anchoResma} ${altoResma}"/>
\t\t\t</MediaIntent>
\t\t\t<Device Class="Implementation" DeviceID="${escapeXML(
      impresora,
    )}" DeviceType="Press" ID="ID_Device_Press_${index}" Status="Available"/>
\t\t\t<ArtDeliveryIntent ID="ID_ArtDeliveryIntent_${index}" Class="Intent" Status="Available">
\t\t\t\t<ArtDelivery ArtDeliveryType="DigitalFile">
\t\t\t\t\t<RunListRef rRef="ID_Run_${index}"/>
\t\t\t\t</ArtDelivery>
\t\t\t</ArtDeliveryIntent>
\t\t\t<RunList ID="ID_Run_${index}" Class="Parameter" NPage="${paginas}" Pages="0 ~ ${Math.max(
      paginas - 1,
      0,
    )}" Status="Available">
\t\t\t\t<LayoutElement>
\t\t\t\t\t<FileSpec MimeType="application/pdf" URL="${escapeXML(url)}"/>
\t\t\t\t</LayoutElement>
\t\t\t</RunList>
\t\t</ResourcePool>
\t</JDF>`;
};

const template = async (
  orden,
  nombre,
  tipoTrabajo,
  partes,
  cliente,
  contactoClienteNombre = "Nombre",
  contactoClienteApellido = "Apellido",
  contactoClienteEmail = "Email",
  cantidad = 1,
  jobId,
  tenant,
) => {
  const safeOrden = orden || "SinOrden";
  const safeNombre = nombre || "Trabajo";
  const safePartes = Array.isArray(partes) && partes.length > 0 ? partes : [{}];
  const totalParts = safePartes.length;
  const nowIso = new Date().toISOString();

  const firstPart = safePartes[0] || {};
  const finalWidth = toNumber(firstPart.ancho, 0);
  const finalHeight = toNumber(firstPart.alto, 0);
  const finalProductType = jobTypeFinal[tipoTrabajo] || "Other";
  const bindingOrder = binding[tipoTrabajo] || "None";
  const rootJobPartId = `ID_24_ApoXML-${slugForPath(safeOrden, "SinOrden")}_${slugForPath(
    safeNombre,
    "Trabajo",
  )}`;

  const partialComponents = (
    await Promise.all(
      safePartes.map((part, index) => buildPartialComponent(part, index, tenant)),
    )
  ).join("\n");

  const rootPartLinks = safePartes
    .map((part, index) => buildRootPartLink(part, index))
    .join("\n");

  const childJdfs = safePartes
    .map((part, index) =>
      buildChildJDF(part, index, {
        rootJobPartId,
        nombre: safeNombre,
        cliente,
        nowIso,
      }),
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<JDF 
\tJobID="ApoXML-${escapeXML(safeOrden)}" 
\tActivation="Active" 
\tDescriptiveName="${escapeXML(safeNombre)}" 
\tJobPartID="${escapeXML(rootJobPartId)}" 
\tID="ApoXMLJob"  
\tStatus="Waiting" 
\tType="Product" 
\tVersion="1.4" 
\tMaxVersion="1.4" 
\tICSVersions="Base_L1-1.4" 
\txsi:type="Product" 
\txmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
\txmlns="http://www.CIP4.org/JDFSchema_1_1" 
\txmlns:agfa="http://www.agfa.com/w3c/gs/jdf/agfaextensions.xsd">
\t<!--Created using Convertor v1.2.7 and stylesheet: v1.3.3 for Prepress v110-->
\t<!--General Job Comment-->
\t<Comment Name="${escapeXML(safeNombre)}" AgentName="Hamlet Convertor" AgentVersion="1.3.3">www.hamlet.com.ar/jobs/edit/${escapeXML(
    jobId || "",
  )}</Comment>
\t<ResourcePool>
\t\t<Component ID="ID_Component_FinalProduct" Class="Quantity" Status="Unavailable" ComponentType="FinalProduct" DescriptiveName="${escapeXML(
      safeNombre,
    )}" ProductType="${finalProductType}" Dimensions="${finalWidth} ${finalHeight} 0">
\t\t\t<!--@ProductType is one of: 'Flatwork', 'Folded', 'Brochure' or 'Other;. 'Flatwork' is the only ProductType allowed for Asanti. -->
\t\t</Component>
\t\t<ColorPool ID="ID_ColorPool_CMYK" Class="Parameter" Status="Available">
\t\t\t<Color Name="Cyan" CMYK="1 0 0 0" ColorType="Normal"/>
\t\t\t<Color Name="Magenta" CMYK="0 1 0 0" ColorType="Normal"/>
\t\t\t<Color Name="Yellow" CMYK="0 0 1 0" ColorType="Normal"/>
\t\t\t<Color Name="Black" CMYK="0 0 0 1" ColorType="Normal"/>
\t\t</ColorPool>
\t\t<ColorIntent ID="ID_ColorIntent_CMYK" Class="Intent" Status="Available">
\t\t\t<ColorPoolRef rRef="ID_ColorPool_CMYK"/>
\t\t\t<ColorsUsed>
\t\t\t\t<SeparationSpec Name="Cyan"/>
\t\t\t\t<SeparationSpec Name="Magenta"/>
\t\t\t\t<SeparationSpec Name="Yellow"/>
\t\t\t\t<SeparationSpec Name="Black"/>
\t\t\t</ColorsUsed>
\t\t\t<ColorStandard DataType="NameSpan" Actual="CMYK"/>
\t\t</ColorIntent>
\t\t<ColorPool ID="ID_ColorPool_Gray" Class="Parameter" Status="Available">
\t\t\t<Color Name="Black" CMYK="0 0 0 1" ColorType="Normal"/>
\t\t</ColorPool>
\t\t<ColorIntent ID="ID_ColorIntent_Gray" Class="Intent" Status="Available">
\t\t\t<ColorPoolRef rRef="ID_ColorPool_Gray"/>
\t\t\t<ColorsUsed>
\t\t\t\t<SeparationSpec Name="Black"/>
\t\t\t</ColorsUsed>
\t\t\t<ColorStandard DataType="NameSpan" Actual="Monochrome"/>
\t\t</ColorIntent>
${partialComponents}
\t\t<BindingIntent ID="ID_BindingIntent" Class="Intent" BindingOrder="${bindingOrder}" Status="Available"/>
\t\t<CustomerInfo ID="ID_CustomerInfo_Main" Class="Parameter" Status="Available" CustomerID="PI_CompApoXML">
\t\t\t<ContactRef rRef="ID_Contact_Main"/>
\t\t</CustomerInfo>
\t\t<Contact ID="ID_Contact_Main" Class="Parameter" Status="Available" ContactTypes="Customer Administrator">
\t\t\t<Company OrganizationName="${escapeXML(cliente)}" ProductID="PI_CompApoXML"/>
\t\t\t<Person FamilyName="${escapeXML(contactoClienteApellido)}" DescriptiveName="${escapeXML(
      `${contactoClienteNombre}_${contactoClienteApellido}`,
    )}" FirstName="${escapeXML(contactoClienteNombre)}" ProductID="PI_Pers_apoxmlNV">
\t\t\t\t<ComChannel ChannelType="Phone" ChannelTypeDetails="LandLine" Locator="12345"/>
\t\t\t\t<ComChannel ChannelType="Email" Locator="${escapeXML(contactoClienteEmail)}"/>
\t\t\t</Person>
\t\t</Contact>
\t\t<NodeInfo Class="Parameter" ID="ID_NodeInfo_Root" NodeStatus="Waiting" Status="Available"/>
\t</ResourcePool>
\t<ResourceLinkPool>
\t\t<NodeInfoLink rRef="ID_NodeInfo_Root" Usage="Input"/>
\t\t<CustomerInfoLink rRef="ID_CustomerInfo_Main" Usage="Input"/>
\t\t<ComponentLink rRef="ID_Component_FinalProduct" Usage="Output" Amount="${asPositiveInt(cantidad, 1)}"/>
\t\t<BindingIntentLink rRef="ID_BindingIntent" Usage="Input"/>
${rootPartLinks}
\t</ResourceLinkPool>
\t<AuditPool>
\t\t<Created ID="crea_root_ID" AgentName="Hamlet Convertor" TimeStamp="${nowIso}" AgentVersion="1.3.3"/>
\t</AuditPool>
${childJdfs}
</JDF>
`;
};

module.exports = template;
