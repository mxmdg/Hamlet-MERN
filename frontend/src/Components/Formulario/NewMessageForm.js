import { getPrivateElements } from "../customHooks/FetchDataHook";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const PreferencesForm = () => {
  const context = useContext(AuthContext);
  const usersList = [];
  const users = async () => {
    try {
      const res = await getPrivateElements("memberships");
      //console.log(res);
      res.map((item) => {
        usersList.push({
          text: item.userId.Name + " " + item.userId.LastName,
          value: item.userId._id,
        });
      });
      return res;
    } catch (error) {
      return error.message;
    }
  };

  users();

  /*
 {
      pricing: {
        gain: {
          min: { type: Number, default: 20 },
          max: { type: Number, default: 60 },
        },
        commission: {
          min: { type: Number, default: 0 },
          max: { type: Number, default: 20 },
        },
      },

      mail: {
        from: { type: String },
        host: { type: String },
        port: { type: Number },
        secure: { type: Boolean, default: true },
        user: { type: String },
        pass: { type: String },
      },

      locale: {
        currency: { type: String, default: "ARS" },
        language: { type: String, default: "es" },
      },
    },
*/
  const papyrusConnection = [
    {
      label: "Conexion a Papyrus",
      type: "Divider",
      id: "papyrus_concection_div",
      size: 12,
      align: "center",
      orientation: "horizontal",
    },
    {
      inputName: "extensions.papyrusExtractUrl",
      label: "URL Papyrus Extract Extension",
      type: "Text",
      id: "papyrusExtract_url",
      required: true,
      help: "URL de la aplicacion Papyrus Extract.",
    },
  ];

  const pdfValidator = [
    {
      label: "Revision de archivos PDF",
      type: "Divider",
      id: "pdf_validator_div",
      size: 12,
      align: "center",
      orientation: "horizontal",
    },
    {
      inputName: "extensions.pdfValidatorUrl",
      label: "URL PDF Revision",
      type: "Text",
      id: "pdf_validator_url",
      required: true,
      help: "URL de la aplicacion PDF Revision.",
    },
  ];

  let preferencesForm = [
    // Pricing - Gain
    {
      label: "Margenes de ganancia",
      type: "Divider",
      id: "pricing_commission_div",
      size: 12,
      align: "center",
      orientation: "horizontal",
    },
    {
      inputName: "pricing.gain.min",
      label: "Ganancia mínima (%)",
      type: "SmartMeasure",
      subtype: "percentage",
      id: "pricing_gain_min",
      required: true,
      help: "Porcentaje mínimo de ganancia (valor por defecto 20%).",
    },
    {
      inputName: "pricing.gain.max",
      label: "Ganancia máxima (%)",
      type: "SmartMeasure",
      subtype: "percentage",
      id: "pricing_gain_max",
      required: true,
      help: "Porcentaje máximo de ganancia (valor por defecto 60%).",
    },
    {
      inputName: "pricing.gain.def",
      label: "Ganancia predeterminada (%)",
      type: "SmartMeasure",
      subtype: "percentage",
      id: "pricing_gain_def",
      required: true,
      help: "Porcentaje predeterminado de ganancia.",
    },

    // Pricing - Commission
    {
      label: "Margenes de Comisiones",
      type: "Divider",
      id: "pricing_gain_div",
      size: 12,
      align: "center",
      orientation: "horizontal",
    },
    {
      inputName: "pricing.commission.min",
      label: "Comisión mínima (%)",
      type: "SmartMeasure",
      subtype: "percentage",
      id: "pricing_comm_min",
      required: true,
      help: "Porcentaje mínimo de comisión (valor por defecto 0%).",
    },
    {
      inputName: "pricing.commission.max",
      label: "Comisión máxima (%)",
      type: "SmartMeasure",
      subtype: "percentage",
      id: "pricing_comm_max",
      required: true,
      help: "Porcentaje máximo de comisión (valor por defecto 20%).",
    },
    {
      inputName: "pricing.commission.def",
      label: "Comisión predeterminada (%)",
      type: "SmartMeasure",
      subtype: "percentage",
      id: "pricing_comm_def",
      required: true,
      help: "Porcentaje predeterminado de comisión (valor por defecto 0%).",
    },

    // Mail simplificado
    {
      label: "Correo electronico",
      type: "Divider",
      id: "mail_div",
      size: 12,
      align: "center",
      orientation: "horizontal",
    },
    {
      inputName: "mail.displayName", // Nuevo campo
      label: "Nombre de la Imprenta",
      type: "Text",
      id: "mail_display_name",
      help: "Nombre que verán tus clientes al recibir el presupuesto (ej: Imprenta Dorrego).",
    },
    {
      inputName: "mail.from",
      label: "Mail de contacto (Responder a)",
      type: "email",
      id: "mail_from",
      help: "Dirección donde recibirás las respuestas de tus clientes.",
    },
    {
      label: "Unidades",
      type: "Divider",
      id: "mail_div",
      size: 12,
      align: "center",
      orientation: "horizontal",
    },
    {
      inputName: "units.weight",
      label: "Unidad de medida para peso",
      type: "Select",
      size: { xs: 12, md: 6 },
      options: [
        { text: "Gramos (g)", value: "g" },
        { text: "Kilogramos (kg)", value: "kg" },
        { text: "Libras (lb)", value: "lb" },
      ],
      id: "unit_weight",
    },
    {
      inputName: "units.size",
      label: "Unidad de medida para dimensiones",
      type: "Select",
      size: { xs: 12, md: 6 },
      options: [
        { text: "Milímetros (mm)", value: "mm" },
        { text: "Centímetros (cm)", value: "cm" },
        { text: "Metros (m)", value: "m" },
        { text: "Pulgadas (in)", value: "in" },
        { text: "Puntos (pt)", value: "pt" },
      ],
      id: "unit_length",
    },
  ];

  if (context.usePlan === "pro") {
    preferencesForm.push(papyrusConnection[0], papyrusConnection[1]);
    preferencesForm.push(pdfValidator[0], pdfValidator[1]);
  }

  return preferencesForm;
};

export default PreferencesForm;
