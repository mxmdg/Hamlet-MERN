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

  // Mail
  {
    inputName: "mail.from",
    label: "Mail desde (from)",
    type: "email",
    id: "mail_from",
    help: "Dirección de correo remitente usada por el sistema.",
  },
  {
    inputName: "mail.host",
    label: "Host SMTP",
    type: "Text",
    id: "mail_host",
    help: "Servidor SMTP (ej: smtp.mail.com).",
  },
  {
    inputName: "mail.port",
    label: "Puerto SMTP",
    type: "Number",
    id: "mail_port",
    help: "Puerto del servidor SMTP (ej: 587).",
  },
  {
    inputName: "mail.secure",
    label: "Conexión segura (SSL/TLS)",
    type: "Select",
    id: "mail_secure",
    options: [
      { text: "Sí", value: true },
      { text: "No", value: false },
    ],
    help: "Usar conexión segura para SMTP (valor por defecto: Sí).",
  },
  {
    inputName: "mail.user",
    label: "Usuario SMTP",
    type: "Text",
    id: "mail_user",
    help: "Usuario para autenticación SMTP.",
  },
  {
    inputName: "mail.pass",
    label: "Password SMTP",
    type: "Password",
    id: "mail_pass",
    help: "Contraseña para autenticación SMTP.",
  },

  // Locale
  {
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
  },
];

export default preferencesForm;
