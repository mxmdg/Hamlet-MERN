const { Schema, model, default: mongoose } = require('mongoose');
const bcrypt = require("bcrypt")


const usersSchema = new Schema(
    {   Name: {
        type: String, 
        required: [true, 'Ingrese su nombre'],
        },
    LastName: {
        type: String, 
        required: [true, 'Ingrese su apellido']},
    Role: { type: String, 
            required: true, 
            enum: ["Admin", "Manager", "Operator", "Customer"]
        },
    email: {
        type: String, 
        required: [true, 'Ingrese su email'], 
        match: (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)}, 
    password: {type: String, required: true}
});

usersSchema.pre("save", function(next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
})

module.exports.esquema = model('users', usersSchema);
module.exports.clase = usersSchema;