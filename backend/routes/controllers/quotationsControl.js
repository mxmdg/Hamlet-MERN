const quotations = require("../../models/quotations");
const Jobs = require("../../models/Jobs");
const Users = require("../../models/usersSchema");
const { sendMailByResend } = require("../../services/mail");
const { getTenantSettings } = require("../../services/getTenantSettings");

function extractMailSettings(flatSettings) {
  return {
    from: flatSettings["mail.from"],
    host: flatSettings["mail.host"],
    port: flatSettings["mail.port"],
    secure: flatSettings["mail.secure"],
    user: flatSettings["mail.user"],
    pass: flatSettings["mail.pass"],
  };
}

const quotationsControl = {};

// Obtener todas las cotizaciones - Filtros avanzados
quotationsControl.getQuotations = async (req, res) => {
  try {
    const tenant = req.header("x-tenant");
    const queryText = req.query.Q || "";
    const property = req.query.P || "name";
    let operator = req.query.OP || "eq"; // Default to 'eq' if not provided
    const schemaType = quotations.esquema.schema.paths[property]?.instance;
    const max = req.query.M || null;

    let query;
    if (operator === "bt") {
      query = {
        [property]: { $gte: Number(queryText), $lte: Number(max) },
      };
    } else if (schemaType === "String") {
      // Para texto, usar regex
      query = { [property]: { $regex: queryText, $options: "i" } };
    } else if (schemaType === "Date") {
      // Buscar fechas parcialmente usando $expr y $dateToString
      query = {
        $expr: {
          $regexMatch: {
            input: {
              $dateToString: {
                format: "%Y-%m-%dT%H:%M:%S.%LZ",
                date: `$${property}`,
              },
            },
            regex: queryText,
            options: "i",
          },
        },
      };
    } else if (schemaType === "Number") {
      // Para números, usar operador dinámico
      operator === "bt" ? (operator = "eq") : operator;
      query = { [property]: { [`$${operator}`]: Number(queryText) } };
    } else if (schemaType === "ObjectID") {
      // Para IDs, buscar por igualdad
      query = { [property]: queryText };
    } else if (property === "data.resumen") {
      // Ejemplo para arrays
      query = { [property]: { $size: parseInt(queryText) + 1 } };
    } else {
      // Por defecto, buscar por igualdad
      query = { [property]: queryText };
    }

    // incluir tenant y excluir estados rechazados
    const allQuotations = await quotations.esquema
      .find({ ...query, tenant })
      .populate({
        path: "jobId",
        model: Jobs.esquema,
        select: "Nombre Owner Entrega",
      })
      .populate({ path: "owner", model: Users.esquema })
      .sort({ index: -1 }); // Ordenar por índice descendente

    res.json(allQuotations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las cotizaciones" });
  }
};

// Obtener una cotización por ID
quotationsControl.getQuotation = async (req, res) => {
  try {
    const tenant = req.header("x-tenant");
    const quotation = await quotations.esquema.findOne({
      _id: req.params.id,
      tenant,
    });
    if (quotation) {
      res.json(quotation);
    } else {
      res.status(404).json({ message: "Cotización no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la cotización" });
  }
};

// Crear una nueva cotización
quotationsControl.addQuotation = async (req, res) => {
  try {
    const tenant = req.header("x-tenant");
    const newQuotation = new quotations.esquema({ ...req.body, tenant });
    await newQuotation.save();
    res.json({ message: "Cotización guardada OK", quotation: newQuotation });
  } catch (error) {
    console.log("Errore en node.js al guardar cotizacion");
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al guardar la cotización " + error });
  }
};

// Actualizar una cotización existente
quotationsControl.updateQuotation = async (req, res) => {
  try {
    const tenant = req.header("x-tenant");
    const updatedQuotation = await quotations.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
      req.body,
      { new: true }
    );
    if (updatedQuotation) {
      res.json({
        message: "Cotización actualizada",
        quotation: updatedQuotation,
      });
    } else {
      res.status(404).json({ message: "Cotización no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la cotización" });
  }
};

//Enviar una cotizacion por email
/* quotationsControl.sendQuotationEmail = async (req, res) => {
  try {
    const { quotationId, toEmail, subject, message } = req.body;

    if (!toEmail) {
      return res.status(404).json({
        message: "La direccion de correo no es válida",
      });
    }

    // Enviar correo electrónico con el enlace para aprobar la cotizacion
    const transporterOutOfService = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: mailAccount.user, // tu dirección de correo electrónico de Gmail
        pass: mailAccount.pass, // tu contraseña de Gmail
      },
    });

    // verify connection configuration
    mailer.transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    const mailOptions = {
      from: "Hamlet",
      to: toEmail,
      subject: subject,
      text: message, // versión texto plano
      html: req.body.html || message.replace(/\n/g, "<br/>"), // versión HTML
    };

    mailer.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error al enviar la cotizacion: " + error,
        });
      } else {
        return res.status(200).json({
          message: "Correo enviado exitosamente",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar la cotización" });
  }
}; */

quotationsControl.sendQuotationEmail = async (req, res, next) => {
  try {
    const { toEmail, subject, message, html } = req.body;
    const tenantId = req.header("x-tenant");

    // 1. Obtenemos los ajustes del tenant
    const settings = await getTenantSettings(tenantId);

    // 2. Extraemos solo lo que necesitamos para la nueva lógica
    // Usamos el mail configurado como 'from' en tu tabla para el 'replyTo'
    const tenantReplyEmail = settings["mail.from"] || settings["mail.user"];
    // Podrías obtener el nombre de la imprenta de los ajustes si existe
    const tenantName = settings["tenant.name"] || "Imprenta";

    if (!toEmail) {
      return res
        .status(400)
        .json({ message: "La dirección de correo no es válida" });
    }

    // 3. Enviamos vía Resend (usando la función que ya tenés)
    await sendMailByResend({
      from: `${tenantName} <no-reply@hamlet.com.ar>`, // Identidad de Hamlet, nombre de Imprenta
      to: toEmail,
      subject: subject,
      text: message,
      html: html || message.replace(/\n/g, "<br/>"),
      reply_to: tenantReplyEmail, // <-- ACÁ sucede la magia del contacto directo
      bcc: [tenantReplyEmail], // <-- Copia oculta para el historial del cliente
    });

    return res.status(200).json({
      message: "Presupuesto enviado exitosamente",
    });
  } catch (error) {
    console.error("Error al enviar cotización:", error);
    next(error);
  }
};

// Eliminar una cotización
quotationsControl.deleteQuotation = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const deletedQuotation = await quotations.esquema.findOneAndUpdate(
      { _id: req.params.id, tenant },
      { status: "inactivo" },
      { new: true }
    );
    if (deletedQuotation) {
      res.json({
        message: "Cotización desactivada",
        quotation: deletedQuotation,
      });
    } else {
      res.status(404).json({ message: "Cotización no encontrada" });
    }
  } catch (error) {
    next(error);
  }
};

quotationsControl.getDeletedQuotations = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const deleted = await quotations.esquema.find({
      tenant,
      status: { $eq: "Rechazado" },
    });
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};

quotationsControl.updateStatus = async (req, res, next) => {
  try {
    const tenant = req.header("x-tenant");
    const q = await quotations.esquema.findOne({ _id: req.params.id, tenant });
    if (!q)
      return res.status(404).json({ message: "Cotización no encontrada" });
    q.status = q.status !== "Rechazado" ? "Rechazado" : "Pendiente";
    await q.save();
    res.json({ message: "Estado actualizado", quotation: q });
  } catch (error) {
    next(error);
  }
};

module.exports = quotationsControl;
