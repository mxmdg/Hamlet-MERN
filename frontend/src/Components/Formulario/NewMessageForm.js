import { getPrivateElements } from "../customHooks/FetchDataHook";
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

let preferencesForm = [
  // Pricing - Gain
  {
    inputName: "pricing.gain.min",
    label: "Ganancia mínima (%)",
    type: "Number",
    id: "pricing_gain_min",
    required: true,
    help: "Porcentaje mínimo de ganancia (valor por defecto 20%).",
  },
  {
    inputName: "pricing.gain.max",
    label: "Ganancia máxima (%)",
    type: "Number",
    id: "pricing_gain_max",
    required: true,
    help: "Porcentaje máximo de ganancia (valor por defecto 60%).",
  },
  {
    inputName: "pricing.gain.def",
    label: "Ganancia predeterminada (%)",
    type: "Number",
    id: "pricing_gain_def",
    required: true,
    help: "Porcentaje predeterminado de ganancia.",
  },

  // Pricing - Commission
  {
    inputName: "pricing.commission.min",
    label: "Comisión mínima (%)",
    type: "Number",
    id: "pricing_comm_min",
    required: true,
    help: "Porcentaje mínimo de comisión (valor por defecto 0%).",
  },
  {
    inputName: "pricing.commission.max",
    label: "Comisión máxima (%)",
    type: "Number",
    id: "pricing_comm_max",
    required: true,
    help: "Porcentaje máximo de comisión (valor por defecto 20%).",
  },
  {
    inputName: "pricing.commission.def",
    label: "Comisión predeterminada (%)",
    type: "Number",
    id: "pricing_comm_def",
    required: true,
    help: "Porcentaje predeterminado de comisión (valor por defecto 0%).",
  },

  // Mail simplificado
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

  // Locale
  /* {
    inputName: "locale.currency",
    label: "Moneda por defecto",
    type: "Select",
    id: "locale_currency",
    options: [
      { text: "ARS", value: "ARS" },
      { text: "USD", value: "USD" },
      { text: "EUR", value: "EUR" },
    ],
    help: "Moneda por defecto del sistema.",
  },
  {
    inputName: "locale.language",
    label: "Idioma",
    type: "Select",
    id: "locale_language",
    options: [
      { text: "Español (es)", value: "es" },
      { text: "Inglés (en)", value: "en" },
    ],
    help: "Idioma por defecto del sistema.",
  }, */
];

export default preferencesForm;
