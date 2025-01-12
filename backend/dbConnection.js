const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI
  ? process.env.MONGODB_URI
  : "mongodb://127.0.0.1:27017/";

const dbSwitch = [
  {
    printer: "ImprentaDorrego",
    title: "Imprenta Dorrego",
  },
  {
    printer: "mxm",
    title: "mxmDG",
  },
  {
    printer: "ImprentaCarballo",
    title: "Imprenta Carballo",
  },
  {
    printer: "test",
    title: "Imprenta Dorrego",
  },
  {
    printer: "digital",
    title: "Digital Pritner",
  },
];
const DB = dbSwitch[3];

mongoose.connect(URI + DB.printer, {
  useNewUrlParser: true,
});

const objectDB = mongoose.connection;

objectDB.on("connected", () => "Connected to DB: " + DB.title);
objectDB.on("error", (e) => "Not connected to DB. Error: " + e);

module.exports = mongoose;
