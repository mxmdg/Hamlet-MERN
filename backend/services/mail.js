const nodemailer = require("nodemailer");

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

/* const nodemailer = require("nodemailer");

const mailAccount = { user: process.env.MAILUSER, pass: process.env.MAILPASS };

const mailer = {};

// create reusable transporter object using the default SMTP transport
mailer.transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: mailAccount.user, // tu dirección de correo electrónico de Gmail
    pass: mailAccount.pass, // tu contraseña de Gmail
  },
});

// create reusable sendmail function 
 {object} options - mail options (to, subject, text, html)
 {function} callback - callback function to handle response

mailer.SENDMAIL = async (mailDetails, callback) => {
  try {
    const info = await mailer.transporter.sendMail(mailDetails);
    console.log(info)
    callback(info);
  } catch (error) {
    console.log(error);
  }
};

module.exports = mailer; */
