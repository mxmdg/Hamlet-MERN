const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");

//settings
app.set("port", process.env.PORT || 5000);
app.set("secretKey", "dorrego");

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);
    jwt.verify(token, req.app.get("secretKey"), (error, payload) => {
      if (error) {
        res.json(error);
      } else {
        console.log(payload);
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Necesita un token de seguridad" });
  }
};

app.verifyToken = verifyToken;

// routes
app.get("/", (rej, res) => {
  res.send("Welcome to node.js server");
});
app.use("/Hamlet/jobs", require("./routes/jobs"));
app.use("/Hamlet/jobs/urg", require("./routes/jobs"));
app.use("/Hamlet/Impresoras", require("./routes/printers"));
app.use("/Hamlet/formatos", require("./routes/formatos"));
app.use("/Hamlet/empresas", require("./routes/empresas"));
app.use(
  "/Hamlet/precios",
  (req, res, next) => req.app.verifyToken(req, res, next),
  require("./routes/prices")
);
app.use("/Hamlet/JobParts", require("./routes/jobParts"));
app.use("/Hamlet/materiales", require("./routes/materiales"));
app.use("/Hamlet/users", require("./routes/users"));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
