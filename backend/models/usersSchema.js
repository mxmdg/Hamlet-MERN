const { Schema, model, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const usersSchema = new Schema({
  Name: {
    type: String,
    required: [true, "Ingrese su nombre"],
  },
  LastName: {
    type: String,
    required: [true, "Ingrese su apellido"],
  },
  Role: {
    type: String,
    default: "Customer",
    enum: ["Admin", "Manager", "Operator", "Customer"],
  },
  email: {
    type: String,
    required: [true, "Ingrese su email"],
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
  status: {
    type: String,
    enum: ["activo", "pendiente", "revocado"],
    default: "pendiente",
  },
});

usersSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports.esquema = model("users", usersSchema);
module.exports.clase = usersSchema;
