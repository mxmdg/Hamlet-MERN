const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMailByResend = async (options) => {
  return await resend.emails.send({
    from: options.from,
    to: [options.to],
    subject: options.subject,
    html: options.html,
    text: options.text,
    reply_to: options.reply_to, // Agregado
    bcc: options.bcc || [], // Agregado para el historial
  });
};

module.exports = {
  sendMailByResend,
};

/* const nodemailer = require("nodemailer");

function createTransporter(mailSettings) {
  return nodemailer.createTransport({
    host: mailSettings.host,
    port: mailSettings.port,
    secure: mailSettings.secure,
    auth: {
      user: mailSettings.user,
      pass: mailSettings.pass,
    },
  });
}

async function sendMail({ mailSettings, mailDetails }) {
  const transporter = createTransporter(mailSettings);

  const info = await transporter.sendMail({
    from: mailSettings.from,
    ...mailDetails,
  });

  return info;
}

module.exports = {
  sendMail,
};
 */
