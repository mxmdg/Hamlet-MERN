const express = require('express')
const app = express()
const cors = require('cors')

//settings
app.set('port', process.env.PORT || 5001)

// middlewares
app.use(cors())
app.use(express.json())

// routes
app.get('/', (rej, res)=>{res.send("Welcome to node.js server")})
app.use("/Hamlet/jobs",require('./routes/jobs'));
app.use("/Hamlet/Impresoras",require('./routes/printers'));
app.use("/Hamlet/formatos",require('./routes/formatos'));
app.use("/Hamlet/precios",require('./routes/prices'));
app.use("/Hamlet/JobParts",require('./routes/jobParts'));
app.use("/Hamlet/materiales",require('./routes/materiales'));

module.exports = app