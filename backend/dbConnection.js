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
];
const DB_NAME = dbSwitch[3].printer;

mongoose.connect(URI + DB_NAME, {
  useNewUrlParser: true,
});

const objectDB = mongoose.connection;

objectDB.on("connected", () => console.log("Connected to DB"));
objectDB.on("error", (e) => console.log("Not connected to DB. Error: " + e));

module.exports = mongoose;
